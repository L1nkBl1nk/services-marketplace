const ApiError = require('../error/ApiError')
const {Brand} = require('../models/models')

class BrandController{
    async create(req,res){
        const {name} = req.body
        const brand = await Brand.create({name})
        return res.json(brand)
    }
    
    async getAll(req,res){
        const brands = await Brand.findAll()
        return res.json(brands)
    }

    async deleteBrand(req, res, next){
        try{
        const {id} = req.params
        const brand = await Brand.findByPk(id)
        if (!brand) {
            return next(ApiError.badRequest('Brand not found'))
        }
        await Brand.destroy({where: {id}})
        return res.json({message: "deleted!"})
        }catch(e){
            ApiError.badRequest('Something went wrong')
        }
    }
}

module.exports = new BrandController()