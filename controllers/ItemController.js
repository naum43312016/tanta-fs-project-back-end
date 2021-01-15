const Cloudinary = require('../lib/Cloudinary');
const ImageValidator = require('../validation/ImageValidator');
exports.createItem = async (req,res) => {
    if(req.files){
        const image = req.files.image;
        if(!ImageValidator.validateImageType(image)) return res.status(409).json({error: true,message: "Only images allowed"})
        if(!ImageValidator.validateImageSize(image)) return res.status(409).json({error: true,message: "Maximum 10MB image"})
        try{
            const imageUrl = await Cloudinary.uploadImage(image.data);
            res.send(imageUrl)
        }catch{
            res.status(500).send("Server error")
        }
    }else{
        res.status(409).json({error: true,message: "Image not uploaded"})
    }
}