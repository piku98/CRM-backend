const db = require('../models/db')
const jwt = require('jsonwebtoken')
const config = require('../config/config')


module.exports.verifyJWT = (token) => {
    var results;
    try {
        results = jwt.verify(token, config.jwtinfo.jwtkey)
        return [results, null]

    } catch (err) {
        console.log('came here', err)
        return [null, err]
    }
}


module.exports.verifyUserAndPermissions = (id, entity, action) => {

    const promise = new Promise((resolve, reject) => {
        db.users.findOne({ where: { id: id } }).then(user => {
            if (!user) { resolve('user not found') } else {
                db.permissionstable.findOne({ where: { user_id: id, entity: entity, action: action } }).then(permission => {
                    if (!permission) { throw new Error('permission not found.') } else {
                        if (permission.max_allowed < 1) { resolve('crossed permissions quota') } else { resolve(null) }
                    }
                }).catch(err => { reject(err) })
            }

        }).catch(err => { reject(err) })
    })
    return promise

}