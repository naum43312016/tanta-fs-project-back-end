const UserModel = require('../models/UserModel');
const TokenHelper = require('../helpers/TokenHelper');

//for Admin dashboard
exports.getAllUsers = async (req, res) => { 
    const allUsers = await UserModel.getAllUsers();
    if (allUsers) {
        res.json(allUsers);
    } else { 
        res.status(500).send('server error');
    }
}

exports.getUserById = async (req, res) => { 
    const _id = req.params.id;
    if (_id) {
        const user = await UserModel.getUserById(_id);
        if (user) {
            delete user.password;
            res.json(user)
        } else { 
            res.status(404).send('User not found')
        }
    } else { 
        res.status(404).send('Not found')
    }
}

exports.getUserFilter = async (req, res) => {
    const userIdFromToken = await TokenHelper.getUserIdFromRequestToken(req);
    if(!userIdFromToken){
        return res.status(401).json({error: true,message: "Please login"});
    }
    const id = userIdFromToken;
    try {
        const filteredItems = await UserModel.getUserFilter(id, req.query.type);
        return res.status(200).send(filteredItems);
    } catch {
        res.status(500).send('server error');
    }
}

