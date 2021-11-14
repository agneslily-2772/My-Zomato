const User  = require('../Models/Users');

exports.login = (req, res) => {
    const {
        username,
        password
    } = req.body;

    User.find({
        email: username,
        password: password
    }).then(result => {
        if (result.length > 0) {
            res.status(200).json({
                message: "User logged in successfully !!",
                isLoggedIn: true,
                user: result[0]
            });
        } else {
            res.status(400).json({
                message: "Username or password is wrong",
                isLoggedIn: false
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    });

}

exports.signup = (req, res) => {
    const {
        email,
        password,
        firstName,
        lastName
    } = req.body;

    // create a new Object of the User Model class

    const userObj = new User({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName
    });

    // we will call a save method on this object
    userObj.save().then(result => {
        res.status(200).json({
            message: "User Registered successfully !!",
            user: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Error in Database",
            error: error
        });
    });
}