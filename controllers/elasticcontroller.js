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

module.exports.simpleSearchIndex = (queryString, fields, index, from, size, filters) => {
    const promise = new Promise((resolve, reject) => {
        body = {
            from: from,
            size: size,
            query: {
                bool: {
                    must: [{
                        multi_match: {
                            query: queryString,
                            fields: fields

                        }
                    }],

                }


            }
        }
        if (filters) {
            must = []
            for (let i = 0; i < filters.length; i++) {
                must.push({
                    term: filters[i]
                })
            }
            filter = {
                bool: {
                    must: must
                }
            }

            body.query.bool.filter = filter
        }
        //console.log(JSON.stringify(body, null, 2))
        client.search({
            index: index,
            body: body
        }).then((response) => { resolve(response) }).catch(err => {
            console.log('ELASTIC ERROR', err.meta.body.error.root_cause);
            reject(err)
        })
    })
    return promise
}