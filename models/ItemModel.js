const Item = require('../queries/Item');

exports.createItem = async (item,userId) => {
    cropImageUrl(item);
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

exports.searchItems = async (query,page) => {
    const searchQuery = createQueryForSearch(query);
    const itemsResult = await Item.getItemsByQuery(searchQuery,page);
    return itemsResult;
}

const createQueryForSearch = (searchQuery) => {
    if(!searchQuery) return {};
    const query = {};
    query.category = new RegExp(searchQuery.category, 'i');
    query.name = new RegExp(searchQuery.name, 'i');
    query.price = getPriceQuery(searchQuery.price);
    return query;
}

const getPriceQuery = (price) => {
    if(!price) return {$gte :  0, $lte : 1000} //Get all
    let priceArr = price.split("-");
    if(priceArr.length<2) return {$gte :  0, $lte : 1000} //Get all
    let min = parseInt(priceArr[0],10)
    let max = parseInt(priceArr[1],10)
    return {$gte :  min, $lte : max};
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

const cropImageUrl = (item) => {
    let imageUrl = item.imageUrl;
    let startIndex = imageUrl.indexOf("upload");
    if(startIndex<0) return;
    let croppedImageUrl = imageUrl.slice(0,startIndex+7) + "c_crop,h_455,w_729/" + imageUrl.slice(startIndex+7);
    if(!croppedImageUrl) return;
    item.imageUrl = croppedImageUrl;
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