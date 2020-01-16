const nodemailer = require('nodemailer')
const config = require('../config/config')

module.exports.mailer = (tomail, message) => {
    (async() => {
        try {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.emailinfo.email,
                    pass: config.emailinfo.pass
                }
            })

            let sendmail = await transporter.sendMail(Object.assign({
                from: config.emailinfo.email,
                to: tomail
            }, message), (err, info) => {
                if (err) {
                    console.log('Email err: ', err)
                } else {
                    console.log(info)
                }
            })

        } catch (err) {
            console.log(err)

        }

    })();
}