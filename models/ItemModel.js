const Item = require('../queries/Item');

exports.createItem = async (item,userId) => {
    const itemToInsert = getItemToInsert(item);
    const insertionResult = await Item.add(itemToInsert);
    if(insertionResult){
        const itemAddedToUser = await addCreatedItemToUser(insertionResult,userId);
        if(itemAddedToUser){
            return insertionResult;
        }else{
            return null;
        }
    }else{
        return null;
    }
}

exports.getAllItems = async () => {
    const allItems = await Item.getAllItems();
    return allItems;
}

addCreatedItemToUser = async (item,userId) => {
    if(!userId || !item) return null;
    const result = await Item.addItemToUser(item,userId);
    if(result){
        return true;
    }else{
        return false;
    }
}

const getItemToInsert = (item) => {
    return {
        category: item.category,
        imageUrl: item.imageUrl,
        price: item.price,
        name: item.name,
        description: item.description,
        condition: item.condition
    }
}