const { Client } = require('@elastic/elasticsearch')
const config = require('../config/config')
require('array.prototype.flatmap').shim()

const client = new Client({
    node: config.elasticinfo.node,
    auth: {
        username: config.elasticinfo.username,
        password: config.elasticinfo.password
    }
})

module.exports.create = (objects, index) => {
    const promise = new Promise((resolve, reject) => {
        const body = objects.flatMap(doc => [{ index: { _index: index } }, doc])
        client.bulk({ refresh: true, body }).then(response => {
            resolve(response)
        }).catch(err => { reject(err) })
    })
    return promise
}