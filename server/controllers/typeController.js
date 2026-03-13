const {Type} = require('../models/models') 
const ApiError = require('../error/ApiError')


class TypeController{
        async create(req, res, next){
        try{
            const {name} = req.body
            if(!name){
                return next(ApiError.badRequest('Name is required'))
            }

            const type = await Type.create({name})
            return res.json(type)

        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    
    async getAll(req,res){
        const types = await Type.findAll()
        return res.json(types)
    }

    async deleteType(req,res, next){
        try {
            const {id} = req.params
            const type = await Type.findByPk(id)
        if (!type) {
            return next(ApiError.badRequest('Type not found'))
        }
            await Type.destroy({where: {id}})
            res.json({message: 'Deleted'})
        } catch (e) {
            return next(ApiError.badRequest('Something went wrong'))
        }
    }
}

module.exports = new TypeController()