module.exports.fillpermissions = (subscription, user) => {



    permissions_array = []

    //create
    for (let i = 0; i < subscription.create.length; i++) {
        permissions_array.push({
            entity: subscription.create[i].entity_name,
            max_allowed: subscription.create[i].max_allowed,
            action: 'c',
            user_id: user.id
        })
    }

    //update
    for (let i = 0; i < subscription.update.length; i++) {
        permissions_array.push({
            entity: subscription.update[i].entity_name,
            action: 'u',
            user_id: user.id
        })
    }

    //delete
    for (let i = 0; i < subscription.delete.length; i++) {
        permissions_array.push({
            entity: subscription.delete[i].entity_name,
            action: 'd',
            user_id: user.id
        })
    }

    //read
    for (let i = 0; i < subscription.read.length; i++) {
        permissions_array.push({
            entity: subscription.read[i].entity_name,
            action: 'r',
            user_id: user.id
        })
    }

    return permissions_array

}