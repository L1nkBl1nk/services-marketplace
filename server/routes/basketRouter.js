const Router = require('express')
const basketController = require('../controllers/BasketController')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', authMiddleware, basketController.getBasket)
router.post('/', authMiddleware, basketController.addDevice)
router.delete('/:id', authMiddleware, basketController.deleteDevice)


module.exports = router
