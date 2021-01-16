const CategoryValidation = require('../validation/CategoryValidation');
const CategoryModel = require('../models/CategoryModel');
//Only for admin
exports.createCategory = async (req,res) => {
    //TO-DO protect only for admin
    const category = req.body;
    const validationResult = CategoryValidation.validateCategoryCreation(category);
    if(validationResult===true){
        CategoryValidation.escapeCharsForCategory(category);
        if(CategoryModel.getCategoryByName(category.name)){
            return res.status(409).json("Category exists");
        }
        const insertionResult = await CategoryModel.createCategory(category);
        if(insertionResult){
            res.send("Category successfully created");
        }else{
            res.status(500).send("Server error");
        }
    }else{
        res.status(409).json(validationResult);
    }
}

exports.getAllCategories = async (req,res) => {
    const categories = await CategoryModel.getAll();
    if(categories){
        res.json(categories);
    }else{
        res.status(500).send("Server error")
    }
}

exports.getCategoryById = async (req,res) => {
    const _id = req.params.id;
    if(_id){
        const category = await CategoryModel.getCategoryById(_id);
        if(category){
            res.json(category);
        }else{
            res.status(404).send("Not found")
        }
    }else{
        res.status(404).send("Not found")
    }
}

exports.getCategoryByName = async (req,res) => {
    const name = req.query.name;
    if(name){
        const category = await CategoryModel.getCategoryByName(name);
        if(category){
            res.json(category);
        }else{
            res.status(404).send("Not found")
        }
    }else{
        res.status(404).send("Not found")
    }
}