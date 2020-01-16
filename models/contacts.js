module.exports.contacts = (sequelize, DataTypes) => {
    let contacts = sequelize.define('contacts', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        ctype: {
            type: DataTypes.TEXT,
        },
        info: {
            type: DataTypes.TEXT,
            unique: true
        }
    }, {
        freezeTableName: true,
        underscored: true
    })
    return contacts
}