const Cloudinary = require('../lib/Cloudinary');
const ImageValidator = require('../validation/ImageValidator');
const ItemValidation = require('../validation/ItemValidation');
const ItemModel = require('../models/ItemModel');
const TokenHelper = require('../helpers/TokenHelper');


exports.createItem = async (req,res) => {
    const userIdFromToken = TokenHelper.getUserIdFromRequestToken(req);
    if(!userIdFromToken){
        return res.status(401).json({error: true,message: "Please login"});
    }
    if(req.files){
        const image = req.files.image;
        if(!ImageValidator.validateImageType(image)) return res.status(409).json({error: true,message: "Only images allowed"})
        if(!ImageValidator.validateImageSize(image)) return res.status(409).json({error: true,message: "Maximum 10MB image"})
        //validate item formdata
        const item = req.body;
        //convert price to int
        item.price = parseInt(item.price,10);
        const validationResult = ItemValidation.validateItemCreation(item);
        if(validationResult===true){
            ItemValidation.escapeCharsForItem(item);
            try{
                const imageUrl = await Cloudinary.uploadImage(image.data);
                if(imageUrl){
                    item.imageUrl = imageUrl;
                    const createdItem = await ItemModel.createItem(item,userIdFromToken);
                    if(createdItem){
                        res.send(createdItem);
                    }else{
                        res.status(500).send("Server error");
                    }
                }else{
                    //Can not upload image, server error
                    res.status(500).send("Server error");
                }
            }catch{
                //Can not upload image, server error
                res.status(500).send("Server error")
            }
        }else{
            res.status(409).json(validationResult)
        }
    }else{
        res.status(409).json({error: true,message: "Image not uploaded"})
    }
}