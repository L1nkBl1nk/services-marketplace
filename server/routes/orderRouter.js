const Router = require('express')
const orderController = require('../controllers/orderController')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')

router.post('/checkout', authMiddleware, orderController.checkout)
router.get('/confirm', authMiddleware, orderController.confirm)
router.get('/', authMiddleware, orderController.getMyOrders)

module.exports = router