// в .env это переменные окружения
require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json()) // для того чтоб мы парсили Json
app.use('/static', express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)


//В КОНЦЕ ОБРОБОТЧИК ОШИБОК!!!
app.use(errorHandler)

//Все функции связанные с базой данных - ТОЛЬКО ассинхронные
const start = async () => {
     try {
        //С помощью auth мы подключаемся в БДшке
        await sequelize.authenticate()
        await sequelize.sync() // сверяет состояние базы данных с ... 
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))        
     } catch(e){
        console.log(e)
     }
} 

start()

