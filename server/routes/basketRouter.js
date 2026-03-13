const Router = require('express')
const basketController = require('../controllers/basketController')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, basketController.getBasket)
router.get('/', authMiddleware, basketController.addDevice)
router.delete('/:id', authMiddleware, basketController.deleteDevice)


module.exports = router
