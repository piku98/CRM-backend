module.exports.contactowners = (sequelize, Datatypes) => {
    let contactowners = sequelize.define('contactowners', {
        id: {
            type: Datatypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Datatypes.TEXT,
        },
        belongs_to: {
            type: Datatypes.BIGINT
        },
        organization: {
            type: Datatypes.TEXT
        },
        description: {
            type: Datatypes.TEXT
        },
        catagory: {
            type: Datatypes.TEXT
        }
    }, {
        freezeTableName: true,
        underscored: true
    })
    return contactowners
}