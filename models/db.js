const Sequelize = require('sequelize')
require('dotenv').config()


const sequelize = new Sequelize(process.env.DEV_DATABASE_URL, {
    schema: 'crm',
    dialect: 'postgres'
})


sequelize.authenticate().then(() => {
    console.log('DB Connection OK.')
}).catch(err => console.log(err))

db = {}

db.sequelize = sequelize
db.Sequelize = Sequelize
db.users = require('./user').users(sequelize, Sequelize)
db.permissionstable = require('./permissiontable').permissions(sequelize, Sequelize)
db.contactowners = require('./contactowners').contactowners(sequelize, Sequelize)
db.contacts = require('./contacts').contacts(sequelize, Sequelize)
db.contacts.belongsTo(db.contactowners, { foreignKey: 'owner' })

module.exports = db