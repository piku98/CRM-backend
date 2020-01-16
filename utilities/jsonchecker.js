function jsonchecker(jsonobject, position) {
    if (jsonobject != null && typeof(jsonobject) == 'object') {
        for (let i in jsonobject) {
            if (!jsonobject[i])
                throw new Error(position + '.' + i + ' is missing')
            jsonchecker(jsonobject[i], position + '.' + i)
        }
    }

}


module.exports = (jsonobject) => {
    try {
        jsonchecker(jsonobject, '')
    } catch (err) {
        return err.message.substr(1)
    }
}