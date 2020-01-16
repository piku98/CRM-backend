module.exports.users = (sequelize, DataTypes) => {
    let users = sequelize.define('users', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        email_verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        freezeTableName: true,
        underscored: true
    })
    return users
}