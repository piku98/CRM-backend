const bcrypt = require('bcrypt')
const db = require('../models/db')
const bodyparser = require('body-parser')
const config = require('../config/config')
const jsonchecker = require('../utilities/jsonchecker')
const message = require('../utilities/errormessage')
const jwt = require('jsonwebtoken')
const defaultpermissions = require('../models/defaultpermissions')
const permissionsarray = require('../utilities/fillpermissionsarray')
const verifier = require('../utilities/verify')
const elasticcontroller = require('./elasticcontroller')


module.exports.createContact = (req, res, next) => {
    [jwt_info, err] = verifier.verifyJWT(req.headers.token)
    if (err) { res.status(401).json(message('invalid jwt.')); return }
    contact_info = {
        name: req.body.name,
        organization: req.body.organization,
        description: req.body.description,
        catagory: req.body.catagory,
        email: req.body.email,
        phone: req.body.phone
    }
    const jsonerr = jsonchecker(contact_info)
    if (jsonerr) { res.json(message(jsonerr)); return }
    if (!(Array.isArray(contact_info['email']) && Array.isArray(contact_info['phone']))) { res.status(400).json(message('email and phone are arrays.')); return }
    (async() => {
        try {

            const verificationerr = await verifier.verifyUserAndPermissions(jwt_info.id, 'contacts', 'c')
            if (verificationerr) { res.status(401).json(message(verificationerr)); return }

            const result = await db.sequelize.transaction(async(t) => {
                const contactowner = await db.contactowners.create({
                    name: contact_info.name,
                    belongs_to: jwt_info.id,
                    organization: contact_info.organization,
                    description: contact_info.description,
                    catagory: contact_info.catagory
                }, { transaction: t })
                var contactObjects = [];
                for (let i = 0; i < contact_info.email.length; i++) {
                    contactObjects.push({
                        ctype: 'e',
                        info: contact_info.email[i],
                        owner: contactowner.id
                    })
                }
                for (let i = 0; i < contact_info.phone.length; i++) {
                    contactObjects.push({
                        ctype: 'p',
                        info: contact_info.phone[i],
                        owner: contactowner.id
                    })
                }
                const contact = await db.contacts.bulkCreate(contactObjects, { transaction: t })

                contact_info.id = contactowner.id
                contact_info.belongs_to = jwt_info.id
                contact_info.created_at = contactowner.createdAt
                contact_info.updated_at = contactowner.updatedAt
                const response = await elasticcontroller.create([contact_info], 'contacts')
                    //console.log('ELASTIC RESPONSE', response)
                if (response.statusCode == 200 || response.statusCode == 201) {
                    res.status(200).json({ success: true, message: 'contact successfully created' })
                } else {
                    next(response)
                }


            })


        } catch (err) {
            if (err instanceof db.Sequelize.UniqueConstraintError) {
                res.status(400).json(message('Email ID or phone already present.'))
            } else next(err)

        }
    })();

}


module.exports.simpleSearch = (req, res, next) => {
    [jwt_info, err] = verifier.verifyJWT(req.headers.token)
    if (err) { res.status(401).json(message('invalid jwt.')); return }
    const queryString = req.query.queryString
    const page = req.query.page

    if (!queryString || !page) {
        res.status(400).json(message('Invalid request. Both query string and page no. are required.'))
        return
    }

    (async() => {

            try {

                const verificationerr = await verifier.verifyUserAndPermissions(jwt_info.id, 'contacts', 'r')
                if (verificationerr) { res.status(401).json(message(verificationerr)); return }

                const results = await elasticcontroller.simpleSearchIndex(queryString, ['name', 'organization', 'description', 'catagory', 'email', 'phone'],
                    'contacts', (page - 1) * 10, 10, [{ belongs_to: jwt_info.id }])

                let hits = results.body.hits.hits
                response = {
                    success: true,
                }
                let contacts = []
                for (let i = 0; i < hits.length; i++) {
                    contacts.push(hits[i]._source)
                }
                response.contacts = contacts
                res.status(200).json(response)

            } catch (err) {
                next(err)
            }




        }

    )()


}