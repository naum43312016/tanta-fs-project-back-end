const Category = require('../queries/Category');

exports.createCategory = async (category) => {
    const categoryToInsert = getCategoryForInsertion(category);
    const insertionResult = await Category.add(categoryToInsert);
    return insertionResult;
}

exports.getAll = async () => {
    const result = await Category.getAll();
    return result;
}

exports.getCategoryById = async (_id) => {
    const result = await Category.getById(_id);
    return result;
}
exports.getCategoryByName = async (name) => {
    const result = await Category.getCategoryByName(name);
    return result;
}

const getCategoryForInsertion = (category) => {
    return{
        name: category.name
    }
}