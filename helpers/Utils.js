exports.getPageFromQueryString = (page) => {
    page = Number(page);
    if(!page || isNaN(page) || page<1){
        page = 1;
    }
    return page;
}

exports.checkIfUserHaveItem = (user,itemId) => {
    const userItems = user.items;
    for(let i=0;i<userItems.length;i++){
        if(userItems[i].toString() === itemId){
            return true;
        }
    }
    return false;
}

