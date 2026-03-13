const ApiError = require("../error/ApiError")
const bcrypt = require('bcrypt') //для хранения паролей в БД в хэшированом виде а не в открытом
const jwt = require('jsonwebtoken')
const {User, Basket} = require('../models/models')

const generateJwt = (id, email, role) =>{
    return jwt.sign(
            {id, email, role}, 
            process.env.SECRET_KEY,
            {expiresIn: '24h'}
        )
}

class UserController{
    async registration(req, res, next){
        const {email, password, role} = req.body
        if(!email || !password){
            return next(ApiError.badRequest('Invalid email or password'))
        } 
        const canditate = await User.findOne({where: {email: email}})
        if(canditate){
            return next(ApiError.badRequest('Accout with this email already exists!'))
        }
        const hashPassword = await bcrypt.hash(password, 5) //Функция bcrypt ассинхронная
        const user = await User.create({email, role, password: hashPassword})
        const basket = await Basket.create({userId: user.id})
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token}) 
    }
    
    async login(req,res,next){
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if(!user){
            next(ApiError.badRequest('User doesnt exist!'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if(!comparePassword){
            next(ApiError.badRequest('Wrong password'))
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async checkIfAuth(req,res, next){
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }

    async deleteUser(req, res, next){
        try {
            const {id} = req.params
            const user = await User.findByPk(id)
            if(!user){
                return next(ApiError.badRequest('User not found'))
            }
            await User.destroy({where: {id}}) 
            res.json({message: 'User deleted'})    
        } catch (e) {
            next(ApiError.Internal(e.message))
        }
    }
}

module.exports = new UserController()