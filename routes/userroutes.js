const express = require('express')
const router = express.Router()
const useractions = require('../controllers/useractions')


router.post('/create', useractions.createUser)
router.get('/verifyemail/:token', useractions.verifyUserEmail)
router.post('/login', useractions.loginUser)
router.get('/resendEmail/:id', useractions.resendEmail)

module.exports = router