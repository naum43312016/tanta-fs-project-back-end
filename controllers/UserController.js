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

exports.getUserById = async (req, res) => { 
    const _id = req.params.id;
    if (_id) {
        const user = await UserModel.getUserById(_id);
        if (user) {
            res.json(user)

        } else { 
            res.status(404).send('User not found')

        }
    } else { 
        res.status(404).send('User not found')
    }
}