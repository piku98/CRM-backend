const express = require('express')
const router = express.Router()
const contactsactions = require('../controllers/contactsactions')

router.post('/create', contactsactions.createContact)
router.get('/search', contactsactions.simpleSearch)

module.exports = router