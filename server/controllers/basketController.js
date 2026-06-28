const {Basket, BasketDevice, Device} = require('../models/models')
const ApiError = require('../error/ApiError')

class BasketController{
    async getBasket(req, res, next){
        try{
        const userId = req.user.id
        const basket = await Basket.findOne({where: {userId}})
        const devices = await BasketDevice.findAll({
            where: {basketId: basket.id},
            include: [{model: Device,
                attributes: ['id', 'name', 'price', 'img']
            }],
            order: [['id', 'ASC']]
        })
        return res.json(devices)
        }catch(e){
            next(ApiError.Internal(e.message))
        }
    }

    async addDevice(req, res, next){
        try{
        const {deviceId} = req.body
        const userId = req.user.id
        const basket = await Basket.findOne({where:{userId}})
        // If the item is already in the cart, just bump its quantity
        let basketDevice = await BasketDevice.findOne({where: {basketId: basket.id, deviceId}})
        if(basketDevice){
            basketDevice.quantity += 1
            await basketDevice.save()
        } else {
            basketDevice = await BasketDevice.create({basketId: basket.id, deviceId, quantity: 1})
        }
        return res.json({basketDevice})
        }catch(e){
            next(ApiError.Internal(e.message))
        }
    }

    async updateQuantity(req, res, next){
        try{
            const userId = req.user.id
            const {id} = req.params
            const {quantity} = req.body
            const basket = await Basket.findOne({where: {userId}})
            const basketDevice = await BasketDevice.findOne({where: {id, basketId: basket.id}})
            if(!basketDevice){
                return next(ApiError.badRequest('Item not found in cart'))
            }
            const qty = parseInt(quantity, 10)
            if(!qty || qty < 1){
                // quantity 0 or invalid -> remove the item
                await basketDevice.destroy()
                return res.json({message: 'Removed', removed: true, id: Number(id)})
            }
            basketDevice.quantity = qty
            await basketDevice.save()
            return res.json(basketDevice)
        }catch(e){
            next(ApiError.Internal(e.message))
        }
    }

    async deleteDevice(req, res, next){
        try{
            const userId = req.user.id
            const {id} = req.params
            const basket = await Basket.findOne({where: {userId}})
            await BasketDevice.destroy({where: {id, basketId: basket.id}})
            return res.json({message: 'Deleted'})
        }catch(e){
            next(ApiError.Internal(e.message))
        }

    }
}

module.exports = new BasketController()