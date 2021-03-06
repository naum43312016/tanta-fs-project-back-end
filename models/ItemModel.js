const Item = require('../queries/Item');
const User = require('../queries/User');
const ObjectID = require('mongodb').ObjectID;

exports.createItem = async (item,userId) => {
    const itemToInsert = getItemToInsert(item,userId);
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

exports.getAllPurchasedItems = async () => {
    const allItems = await Item.getAllPurchasedItems();
    return allItems;
}

exports.getItemById = async (_id) => {
    const item = await Item.getItemById(_id);
    return item;
}

exports.searchItems = async (query,page) => {
    const searchQuery = createQueryForSearch(query);
    const itemsResult = await Item.getItemsByQuery(searchQuery,page);
    return itemsResult;
}

exports.addFavoriteItemToUser = async (itemId, userId) => {
    if (!userId || !itemId) return null;
    const result = await Item.addFavoriteItemToUser(itemId, userId);
    return result;
}

exports.removeFavoriteItemFromUser = async(itemId, userId) => {
    if (!userId || !itemId) return null;
    const result = await Item.removeFavoriteItemFromUser(itemId, userId);
    return result;
}

exports.removeItem = async (user,item) => {
    const result = await Item.removeItem(user,item);
    if(result){
        return true;
    }else{
        return false;
    }
}

exports.purchaseItem = async (item, buyer, seller) => {
    if (!item || !buyer || !seller) return null;
    const result = await Item.purchaseItem(item, buyer, seller);
    if(result){
        return true;
    }else{
        return false;
    }
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

const getItemToInsert = (item,sellerId) => {
    return {
        category: item.category,
        imageUrl: item.imageUrl,
        price: item.price,
        name: item.name,
        description: item.description,
        condition: item.condition,
        status: 'available',
        sellerId: ObjectID(sellerId)
    }
}