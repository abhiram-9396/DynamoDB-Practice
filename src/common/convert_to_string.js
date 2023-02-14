const dateToString = (item) => {

    //converting created_at attribute to string...
    if (item['created_at']) {
        if (typeof item['created_at'] === 'object') {
            item['created_at'] = item['created_at'].toString();
        }
    }

    //converting updated_at attribute to string...
    if (item['updated_at']) {
        if (typeof item['updated_at'] === 'object') {
            item['updated_at'] = item['updated_at'].toString();
        }
    }

    return item
}

module.exports =  dateToString;
