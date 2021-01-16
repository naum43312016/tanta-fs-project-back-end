const ItemModel = require('../models/ItemModel');

exports.searchItems = async (req,res) => {
    const query = getSearchQuery(req.query);
    const page = getSearchPage(req.query);
    const resultItems = await ItemModel.searchItems(query,page);
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

const getSearchPage = (query) => {
    let page = query.page ? parseInt(query.page,10) : 1;
    if(isNaN(page) || page < 1) return 1;
    return page;
}