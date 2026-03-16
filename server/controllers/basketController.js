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
            }]
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
        const basketDevice = await BasketDevice.create(
            {
                basketId: basket.id,    
                deviceId
            },
        )    
        return res.json({basketDevice})
        
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