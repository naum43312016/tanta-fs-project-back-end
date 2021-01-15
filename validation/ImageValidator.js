exports.validateImageType = (image) => {
    if(!image.mimetype.includes("image")){
        return false;
    }
    return true;
}
exports.validateImageSize = (image) => {
    const size = image.size/1024/1024;
    //Maximum file size 10MB
    if(size>10){
        return false;
    }else{
        return true;
    }
}