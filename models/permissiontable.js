module.exports.permissions = (sequelize, Datatypes) => {
    let permissions = sequelize.define('permissions', {
        id: {
            type: Datatypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        entity: {
            type: Datatypes.TEXT,
        },
        max_allowed: {
            type: Datatypes.BIGINT
        },
        action: {
            type: Datatypes.TEXT
        }

    }, {
        freezeTableName: true,
        underscored: true
    })
    return permissions
}