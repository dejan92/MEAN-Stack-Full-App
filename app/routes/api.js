const express = require('express');
const router = express.Router();

let User = require('../models/user');
const jwt = require('jsonwebtoken');

let secret = 'mysecret';

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
                    message: `'Username or Email already exist' , ${err}`
                });
            } else {
                //.status(201)
                res.json({
                    success: true,
                    message: 'User created'
                    //error - it saves the password as plain text .. 
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
                //return validPassword;
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
                let token = jwt.sign({
                    username: user.username,
                    email: user.email
                }, secret, {
                    expiresIn: '24h'
                });
                res.json({
                    success: true,
                    message: 'User authenticated !',
                    token: token
                })
            }
        }
    });
});

router.use((req, res, next) => {
    let token = req.body.token || req.body.query || req.headers('x-access-token');

    if (token) {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                res.json({
                    success: false,
                    message: 'Invalid token'
                })
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.json({
            success: false,
            message: 'No token provided!'
        })
    }
});

router.post('/currentuser', (req, res) => {
    res.send(req.decoded);
})


//Export routes to the main server.js file
module.exports = router;