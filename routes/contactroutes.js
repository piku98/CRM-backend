const express = require('express')
const router = express.Router()
const contactsactions = require('../controllers/contactsactions')

router.post('/create', contactsactions.createContact)

module.exports = router