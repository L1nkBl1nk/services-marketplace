//папка error - универсальный handler для ошибок АПИ
class ApiError extends Error{
    constructor(status, message){
        super(); //вызываем родительский конструктор
        this.status = status
        this.message = message

    }
    static badRequest(message){
        return new ApiError(400, message)
    }
    
    static Internal(message){
        return new ApiError(500, message)
    }
    
    static forbidden(message){
        return new ApiError(403, message)
    }

    
}

    module.exports = ApiError   