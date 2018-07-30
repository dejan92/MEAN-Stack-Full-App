const express = require('express');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const secret = 'mysecret';

module.exports = function(app, passport){
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false} }));

    passport.serializeUser(function(user,done){
        token = jwt.sign({ username: user.username, email: user.email } , secret, { expiresIn: '24h' } )
        done(null, user.id)
    });

    passport.deserializeUser(function(id,done){
        User.findById(id, function(err, user){
            done(err, user)
        });
    });

    passport.use(new FacebookStrategy({
        clientID: 239670323322789,
        clientSecret: '14e82c62817481f4fff9afb6ac81ffeb',
        callbackURL: "http://localhost:5000/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'email']
      },
      function(accessToken, refreshToken, profile, done) {
          User.findOne({ email: profile._json.email }).select('username password email').exec(function(err,user){
            if (err) done(err);
            if (user && user != null) {
                done(null, user);
            } else {
                done(err);
            }
          });
      }
    ));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/facebookerror' }), function(req,res){
        res.redirect('/facebook' + token);
    });
    app.get('auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

    return passport;
};