const User = require('../queries/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.addUserToDb = async (user) => {
    const passwordHash = getPasswordHash(user.password);
    user.password = passwordHash;
    const insertionResult = await User.addUser(user);
    if(insertionResult){
        const insertedUser = insertionResult.ops[0];
        return insertedUser;
    }else{
        return null;
    }  
}

exports.compareUserPassword = (passwordFromLoginForm, passwordFromDb) => {
    if(bcrypt.compareSync(passwordFromLoginForm, passwordFromDb)){
        return true;
    }else{
        return false;
    }
}

const getPasswordHash = (password) => {
    return bcrypt.hashSync(password, saltRounds);
}