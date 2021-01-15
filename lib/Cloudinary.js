const cloudinary = require('../config/CloudinaryConfig');

exports.uploadImage = async (image) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            (err,result) => {
                if(err){
                    return reject("Can't upload image image")
                }else{
                    return resolve(result.url)
                }
            })
        .end(image)
    })
}