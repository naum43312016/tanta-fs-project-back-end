const UserModel = require('../models/UserModel');
//for Admin dashboard
exports.getAllUsers = async (req, res) => { 
    const allUsers = await UserModel.getAllUsers();
    if (allUsers) {
        res.json(allUsers);
    } else { 
        res.status(500).send('server error');
    }
}