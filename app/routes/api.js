// const express = require('express');
// const router = express.Router();

let User = require('../models/user');

//Export routes to the main server.js file
module.exports = function (router) {

    //user registration route
    router.post('/users', (req, res) => {
        let newUser = new User({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });

        if (req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '') {
            //.status(422)
            res.json({
                success: false,
                message: 'ensure username, email and password are provided'
            })
        } else {
            newUser.save((err) => {
                if (err) {
                    //.status(409)
                    res.json({
                        success: false,
                        message: 'Username or Email already exist'
                    });
                } else {
                    //.status(201)
                    res.json({
                        success: true,
                        message: 'User created'
                    });
                }
            });
        }
    });
    //return router object to server
    return router;
};