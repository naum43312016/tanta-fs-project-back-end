const Validation = require('../validation/Validator');

exports.signUp = (req,res) => {
    let user = req.body;
    const isValid = Validation.validateSignUp(user);
    if(isValid===true){
        res.json(user);
    }else{
        //If not valid, send error to client
        res.json(isValid);
    }
}

exports.login = (req,res) => {
    let user = req.body;
    const isValid = Validation.validateLogin(user);
    if(isValid===true){
        res.json(user);
    }else{
        //If not valid, send error to client
        res.json(isValid);
    }
}

exports.test = (req,res) => {
    res.send("Test endpoint")
}