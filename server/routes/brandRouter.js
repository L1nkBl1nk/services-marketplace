const Router = require('express')
const brandController = require('../controllers/brandController')
const router = new Router()

router.post('/', brandController.create)
router.get('/', brandController.getAll)
router.delete('/:id', brandController.deleteBrand)

module.exports = router