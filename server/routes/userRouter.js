const Router = require('express')
const router = new Router()
const UserController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')
const userController = require('../controllers/userController')

router.post('/registration', UserController.registration)
router.post('/login', UserController.login)
router.get('/auth', authMiddleware ,UserController.checkIfAuth)
router.delete('/:id', checkRole('ADMIN'), userController.deleteUser)

module.exports = router