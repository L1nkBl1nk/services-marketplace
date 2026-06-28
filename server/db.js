const {Sequelize} = require('sequelize')

// Managed Postgres (Neon, Render, etc.) requires SSL — enable with DB_SSL=true
const useSSL = process.env.DB_SSL === 'true'

module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        logging: false,
        dialectOptions: useSSL
            ? { ssl: { require: true, rejectUnauthorized: false } }
            : {}
    }
)