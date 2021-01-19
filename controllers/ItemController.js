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

exports.getItemById = async (req, res) => { 
    const _id = req.params.id;
    if (_id) { 
        const item = await ItemModel.getItemById(_id)
        if (item) {
            res.json(item)
        } else { 
            res.status(404).send("Item not found")
        }

    } else { 
        res.status(404).send("Not found")
    }
}

exports.getAllItems = async (req,res) => {
    const allItems = await ItemModel.getAllItems();
    if(allItems){
        res.json(allItems);
    }else{
        res.status(500).send("Server error");
    }
}

exports.addFavoriteItemToUser = async (req, res) => { 
    const userIdFromToken = TokenHelper.getUserIdFromRequestToken(req);
    if(!userIdFromToken){
        return res.status(401).json({error: true,message: "Please login"});
    }
    const itemId = req.params.id
    if (itemId) {
        const item = await ItemModel.getItemById(itemId);
        if (item) { 
            const result = await ItemModel.addFavoriteItemToUser(itemId, userIdFromToken);
            if (result) {
                res.send('Item added to favorite list');
            }
            else { 
                res.send('Error while adding item to favorites')
            }
        }
        else { 
            res.status(404).send('Item not found')

        }
    } else { 
        res.status(404).send("Not found")

    }
}

exports.deleteFavoriteItemFromUser = async(req, res) => { 
    const userIdFromToken = TokenHelper.getUserIdFromRequestToken(req);
    if (!userIdFromToken) { 
        return res.status(401).json({ error: true, message: "Please login" });
    }
    const itemId = req.params.id
    if (itemId) {
        const item = await ItemModel.getItemById(itemId);
        if (item) { 
            const result = await ItemModel.removeFavoriteItemFromUser(itemId, userIdFromToken);
            if (result) {
                res.send('Item removed from favorite list');
            }
            else { 
                res.send('Error while removing item from favorites')
            }
        }
        else { 
            res.status(404).send('Item not found')

        }   
    } else { 
        res.status(404).send("Not found")

    }

}
//WIP
exports.addPurchasedItemToUser = async (req, res) => { 
    const userIdFromToken = TokenHelper.getUserIdFromRequestToken(req);
    if(!userIdFromToken){
        return res.status(401).json({error: true,message: "Please login"});
    }
    const itemId = req.params.id
    if (itemId) {
        const item = await ItemModel.getItemById(itemId);
        if (item) { 
            console.log(item);
            const result = await ItemModel.addPurchasedItemToUser(itemId, userIdFromToken);
            if (result) {
                res.send('Bought Item Successfully');
            }
            else { 
                res.send('Error while buying item')
            }
        }
        else { 
            res.status(404).send('Item not found')

        }   
    } else { 
        res.status(404).send("Not found")

    }
}
