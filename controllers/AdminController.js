const UserModel = require('../models/UserModel');
const TokenHelper = require('../helpers/TokenHelper');

exports.getAllUsers = async (req,res) => {
    const userIdFromToken = TokenHelper.getUserIdFromRequestToken(req);
    if(userIdFromToken){
        const userFromDb = await UserModel.getUserById(userIdFromToken);
        if(userFromDb && userFromDb.role==="admin"){
            let currentPage = req.query.page;
            const usersListAndCount = await UserModel.getAllUsersForCurrentPage(currentPage);
            if(usersListAndCount){
                res.json(usersListAndCount);
            }else{
                res.status(500).send("Server error");
            }
        }else{
            res.status(403).send("No access");
        }
    }else{
        res.status(403).send("No access");
    }
}