const bcrypt = require('bcrypt')
const db = require('../models/db')
const bodyparser = require('body-parser')
const config = require('../config/config')
const jsonchecker = require('../utilities/jsonchecker')
const message = require('../utilities/errormessage')
const jwt = require('jsonwebtoken')
const defaultpermissions = require('../models/defaultpermissions')
const permissionsarray = require('../utilities/fillpermissionsarray')




module.exports.createUser = (req, res, next) => {
    user_info = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    const err = jsonchecker(user_info)
    if (err) res.status(400).json(message(err))


    bcrypt.hash(user_info.password, config.jwtinfo.saltrounds, (err, hash) => {
        if (err) next(err)
        db.users.create({
            name: user_info.name,
            email: user_info.email,
            password: hash
        }).then((user) => {
            console.log('new user created')

            let message = `Please click the link to verify your account ` + jwt.sign({
                name: user_info.name,
                email: user_info.email,
                created_at: Date.now()
            }, config.jwtinfo.jwtkey)

            message = {
                subject: 'Email Verification',
                text: message
            }

            require('./mailcontroller').mailer(user_info.email, message).then(info => console.log(info)).catch(err => console.log(err))
            res.json({ success: true, message: 'user created, verify email-id.', user_id: user.id })
        }).catch((err) => {
            if (err.constructor.name === 'UniqueConstraintError') {
                res.json(message('Email id already present.'))
            } else next(err)
        })
    })

}

module.exports.verifyUserEmail = (req, res, next) => {
    const token = req.params.token
    jwt.verify(token, config.jwtinfo.jwtkey, (err, decoded) => {
        if (err) {
            console.log(err)
            res.status(400).json(message('Invalid token'))
        } else {
            db.users.findOne({ where: { email: decoded.email } }).then((user) => {
                if (!user) {
                    res.status(400).json(message('Record not found'))
                } else {
                    if (user.email_verified == false) {
                        try {
                            const result = db.sequelize.transaction(async(t) => {
                                const user = await db.users.update({
                                    email_verified: true
                                }, {
                                    where: { email: decoded.email },
                                    returning: true,
                                    plain: true
                                }, { transaction: t })

                                await db.permissionstable.bulkCreate(permissionsarray.fillpermissions(defaultpermissions.permissions.normal_user, user[1].dataValues), { transaction: t })
                                await res.status(200).json({ success: true, message: 'Successfully verified.' })
                            })

                        } catch (err) {
                            next(err)

                        }


                    } else {
                        res.status(200).json({ success: true, message: 'This record is already verified.' })

                    }
                }
            })
        }

    })
}


module.exports.loginUser = (req, res, next) => {
    login_info = {
        email: req.body.email,
        password: req.body.password
    }
    const err = jsonchecker(login_info)
    if (err) { res.json(message(err)); return }

    db.users.findOne({ where: { email: login_info.email } }).then((user) => {
        if (user) {
            bcrypt.compare(login_info.password, user.password, (err, result) => {
                if (err) next(err)
                if (result == true) {
                    if (user.email_verified == false) {
                        res.json(message('email not verified.'))
                    } else {
                        let auth_data = {
                            email: user.email,
                            created_at: Date.now(),
                            name: user.name,
                            id: user.id
                        }
                        let token = jwt.sign(auth_data, config.jwtinfo.jwtkey)
                        res.json({
                            success: true,
                            message: 'Welcome!',
                            token: token
                        })
                    }
                } else {
                    res.json(message('wrong password.'))
                }
            })

        } else {
            res.json(message(`couldn't find your account.`))
        }

    }).catch(err => next(err))
}

module.exports.resendEmail = (req, res, next) => {
    const user_id = req.params.id
    if (!user_id) {
        res.status(400).json(message('provide userid.'))
    }
    (async() => {
        try {
            const user = await db.users.findOne({ where: { id: user_id } })
            if (!user) {
                res.status(401).json(message('user not found.'))
            } else if (user.email_verified) {
                res.status(200).json({ success: true, message: 'email is already verified.' })
            } else {
                let message = `Please click the link to verify your account ` + jwt.sign({
                    name: user.name,
                    email: user.email,
                    created_at: Date.now()
                }, config.jwtinfo.jwtkey)

                message = {
                    subject: 'Email Verification',
                    text: message
                }

                let info = await require('./mailcontroller').mailer(user.email, message)
                console.log(info)

                await res.status(200).json({ success: true, message: 'mail sent' })

            }

        } catch (err) {
            next(err)
        }

    })()
}