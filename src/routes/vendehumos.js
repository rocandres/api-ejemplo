const express = require('express')
const vendehumos_controller = require('../controllers/vendehumos_controller')

const router = express.Router()

router.get('/', vendehumos_controller.list_vendehumos)
router.post('/', vendehumos_controller.create_vendehumo)

module.exports = router
