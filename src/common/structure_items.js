// structuring the items based on their datatypes
function structureItems(item){
    Object.keys(item).map(key => {
        let typeObject;
        switch (typeof item[key]) {
            case 'string':
                typeObject = { 'S': item[key] };
                break;
            case 'number':
                typeObject = { 'N': item[key].toString() };
                break;
            case 'boolean':
                typeObject = { 'B': item[key].toString() };
                break;
            default:
                typeObject = { 'S': item[key].toString() };
                break;
        }
        item[key] = typeObject;
    });
    return item;
}

module.exports = structureItems;