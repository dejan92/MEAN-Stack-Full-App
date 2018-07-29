const express = require('express');
const router = express.Router();

let User = require('../models/user');

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

//user login route
router.post('/authenticate', function (req, res) {
    User.findOne({
        username: req.body.username
    }).select('email username password').exec(function (err, user) {
        if (err) throw err;

        if (!user) {
            res.json({
                success: false,
                message: 'Could not authenticate user'
            })
        } else if (user) {
            if (req.body.password) {
                let validPassword = user.comparePassword(req.body.password);
            } else {
                res.json({
                    success: false,
                    message: 'No password provided'
                });
            }
            
            
            if (!validPassword) {
                res.json({
                    success: false,
                    message: 'Could not authenticate password'
                })
            } else {
                res.json({
                    success: true,
                    message: 'User authenticated !'
                })
            }
        }
    });
})


//Export routes to the main server.js file
module.exports = router;