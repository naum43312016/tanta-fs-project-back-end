const validator = require('validator');

exports.validateItemCreation = (item) => {
    const errorObject = {};
    let errorOccurred = false;
    if(!item){
        errorObject.error = true;
        errorObject.message = "Please fill out required fields!"
        return errorObject;
    }
    if(!item.category || item.category.length > 32){
        errorObject.error = true;
        errorObject.category = "Invalid category!";
        errorOccurred = true;
    }
    if(!item.name || item.name.length > 32){
        errorObject.error = true;
        errorObject.name = "Invalid name!";
        errorOccurred = true;
    }
    if(!item.condition || item.condition.length > 32){
        errorObject.error = true;
        errorObject.condition = "Invalid condition!";
        errorOccurred = true;
    }
    if(!item.description || item.description.length > 1024){
        errorObject.error = true;
        errorObject.description = "Invalid description!";
        errorOccurred = true;
    }
    if(!item.price || isNaN(item.price)){
        errorObject.error = true;
        errorObject.price = "Invalid price!";
        errorOccurred = true;
    }
    return errorOccurred ? errorObject : true;
}

exports.escapeCharsForItem = (item) => {
    item.category = validator.escape(item.category);
    item.name = validator.escape(item.name);
    item.condition = validator.escape(item.condition);
    item.description = validator.escape(item.description);
}