const nodemailer = require('nodemailer')
const config = require('../config/config')

module.exports.mailer = (tomail, message) => {

    let promise = new Promise((resolve, reject) => {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.emailinfo.email,
                pass: config.emailinfo.pass
            }
        })

        transporter.sendMail(Object.assign({
            from: config.emailinfo.email,
            to: tomail
        }, message), (err, info) => {
            if (err) {
                reject(err)
            } else {
                resolve(info)
            }
        })

    })

    return promise

}