const validator = require('validator');

exports.validateCategoryCreation = (category) => {
    const errorObject = {};
    let errorOccurred = false;
    if(!category || category.name.length > 32){
        errorObject.name = "Invalid category name";
        errorObject.error = true;
        errorOccurred = true;
    }
    return errorOccurred ? errorObject : true;
}

exports.escapeCharsForCategory = (category) => {
    category.name = validator.escape(category.name);
}