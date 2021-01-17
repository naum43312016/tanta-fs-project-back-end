exports.getPageFromQueryString = (page) => {
    page = Number(page);
    if(!page || isNaN(page) || page<1){
        page = 1;
    }
    return page;
}