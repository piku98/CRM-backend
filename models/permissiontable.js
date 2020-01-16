module.exports.permissions = (sequelize, Datatypes) => {
    let permissions = sequelize.define('permissons', {
        id: {
            type: Datatypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: Datatypes.BIGINT,
        },
        entity: {
            type: Datatypes.TEXT,
        },
        max_allowed: {
            type: Datatypes.BIGINT
        }
    }, {
        freezeTableName: true,
        underscored: true
    })
    return permissions
}