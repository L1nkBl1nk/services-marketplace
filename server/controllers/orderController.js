const {Basket, BasketDevice, Device, Order, OrderItem} = require('../models/models')
const ApiError = require('../error/ApiError')

// Stripe is initialised lazily so the server still boots without a key configured.
const Stripe = require('stripe')
const stripe = process.env.STRIPE_SECRET_KEY ? Stripe(process.env.STRIPE_SECRET_KEY) : null

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
const SERVER_URL = process.env.SERVER_URL // e.g. https://api.example.com — used for product images in Stripe Checkout

class OrderController {
    // Create an order from the user's cart and start a Stripe Checkout session
    async checkout(req, res, next){
        try{
            if(!stripe){
                return next(ApiError.badRequest('Payments are not configured. Set STRIPE_SECRET_KEY on the server.'))
            }
            const userId = req.user.id
            const basket = await Basket.findOne({where: {userId}})
            const basketDevices = await BasketDevice.findAll({
                where: {basketId: basket.id},
                include: [{model: Device, attributes: ['id', 'name', 'price', 'img']}]
            })

            if(!basketDevices.length){
                return next(ApiError.badRequest('Your cart is empty'))
            }

            const total = basketDevices.reduce(
                (sum, item) => sum + item.device.price * item.quantity, 0
            )

            // Persist the order as "pending" first
            const order = await Order.create({userId, status: 'pending', total})
            await OrderItem.bulkCreate(basketDevices.map(item => ({
                orderId: order.id,
                deviceId: item.device.id,
                name: item.device.name,
                price: item.device.price,
                quantity: item.quantity,
                img: item.device.img
            })))

            // Build Stripe line items
            const line_items = basketDevices.map(item => {
                const img = item.device.img
                const imgUrl = img && img.startsWith('http')
                    ? img
                    : (SERVER_URL && img ? `${SERVER_URL}/static/${img}` : null)
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.device.name,
                            ...(imgUrl ? {images: [imgUrl]} : {})
                        },
                        unit_amount: Math.round(item.device.price * 100)
                    },
                    quantity: item.quantity
                }
            })

            const session = await stripe.checkout.sessions.create({
                mode: 'payment',
                line_items,
                success_url: `${CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${CLIENT_URL}/basket`,
                metadata: {orderId: String(order.id), userId: String(userId)}
            })

            order.stripeSessionId = session.id
            await order.save()

            return res.json({url: session.url})
        }catch(e){
            next(ApiError.Internal(e.message))
        }
    }

    // Confirm payment after Stripe redirects back, then clear the cart
    async confirm(req, res, next){
        try{
            if(!stripe){
                return next(ApiError.badRequest('Payments are not configured. Set STRIPE_SECRET_KEY on the server.'))
            }
            const userId = req.user.id
            const {session_id} = req.query
            if(!session_id){
                return next(ApiError.badRequest('Missing session_id'))
            }

            const order = await Order.findOne({
                where: {stripeSessionId: session_id, userId},
                include: [{model: OrderItem, as: 'items'}]
            })
            if(!order){
                return next(ApiError.badRequest('Order not found'))
            }

            if(order.status === 'paid'){
                return res.json(order)
            }

            const session = await stripe.checkout.sessions.retrieve(session_id)
            if(session.payment_status === 'paid'){
                order.status = 'paid'
                await order.save()
                // Empty the cart on successful payment
                const basket = await Basket.findOne({where: {userId}})
                if(basket){
                    await BasketDevice.destroy({where: {basketId: basket.id}})
                }
            }

            return res.json(order)
        }catch(e){
            next(ApiError.Internal(e.message))
        }
    }

    // Order history for the logged-in user
    async getMyOrders(req, res, next){
        try{
            const userId = req.user.id
            const orders = await Order.findAll({
                where: {userId},
                include: [{model: OrderItem, as: 'items'}],
                order: [['createdAt', 'DESC']]
            })
            return res.json(orders)
        }catch(e){
            next(ApiError.Internal(e.message))
        }
    }
}

module.exports = new OrderController()