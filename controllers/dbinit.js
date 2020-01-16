const db = require('../models/db')


module.exports = (async() => {
    try {
        await db.users.sync()
        await db.contactowners.sync()
        await db.contacts.sync()
        await db.permissionstable.sync()

    } catch (err) {
        console.log(err)
    }

})();