const ItemModel = require('../models/ItemModel');

exports.searchItems = async (req,res) => {
    const query = getSearchQuery(req.query);
    const resultItems = await ItemModel.searchItems(query);
    if(resultItems===null || resultItems===undefined){
        return res.status(500).send("Server error")
    }
    res.json(resultItems);
}

const getSearchQuery = (query) => {
    const searchQuery = {};
    searchQuery.category = query.category ? query.category : '';
    searchQuery.name = query.name ? query.name : '';
    searchQuery.price = query.price ? query.price : '';
    return searchQuery;
}