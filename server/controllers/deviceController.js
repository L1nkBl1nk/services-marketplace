const uuid = require('uuid') //генерирует случайные рандомные idшники которые не будут повторяться
const path = require('path')

const {Device, DeviceInfo} = require('../models/models') 
const ApiError = require('../error/ApiError')

class DeviceController{
    async create(req,res, next){
        try {
            let {name, price, brandId, typeId, info} = req.body
            const {img} = req.files
            let fileName = uuid.v4() +'.jpg'
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const device = await Device.create({name, price, brandId, typeId, info, img: fileName})

            if(info){
                info = JSON.parse(info)
                info.forEach(el => {
                    DeviceInfo.create({
                        title: el.title,
                        description: el.description,
                        deviceId: device.id
                    })
                });
            }

        
            
            return res.json(device)
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    
    async getAll(req,res){
        let {brandId, typeId, limit, page} = req.query
        page = Number(page) || 1
        limit = Number(limit) || 9
        let offset = page * limit - limit //отступ в 9 товаров 
        let devices;
        if(!brandId && !typeId){
            devices = await Device.findAndCountAll({limit, offset})
        }

        if(brandId && !typeId){
            devices = await Device.findAndCountAll({
            where: { brandId: Number(brandId) },
            limit,
            offset
            })
        }

        if(!brandId && typeId){
            devices = await Device.findAndCountAll({
                where: { typeId: Number(typeId) },
                limit,
                offset
                })
        }

        if(brandId && typeId){
            devices = await Device.findAndCountAll({
                where: { 
                    brandId: Number(brandId), 
                    typeId: Number(typeId) 
                },
                limit,
                offset
            })
        }
            return res.json(devices)
    }

    async getOne(req,res){
        const {id} = req.params
        const device = await Device.findOne(
            {
                where: {id}, 
                include: [{model: DeviceInfo, as:'info'}]
            },
        )
        return res.json(device)
    }

    async deleteDevice(req, res, next){
        try{
        const {id} = req.params
        await Device.destroy({where: {id}})
        await DeviceInfo.destroy({where: {deviceId: id}})
        return res.json({message: 'Deleted'})
    }catch(e){
        ApiError.Internal(e.message)
    }
    }
}

module.exports = new DeviceController()