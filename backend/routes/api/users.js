const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {body, validationResult} = require("express-validator");
const AuthenticateToken = require('../../auth/auth');

// Load User model
const User = require("../../models/User");

userRouter.post("/register",
    body('email').isEmail(),
    body('password').isLength({min: 4, max: 50}),
    body('contact').isNumeric(),
    body('age').isNumeric(),
    (req, res) => {
        console.log({email: req.body.email, pass: req.body.password})
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(500).json({errors: errors.array()})
        }
        User.findOne({username: req.body.username}).then((user) => {
            if (user) {
                return res.status(400).json({errors: ["Username already exists."]});
            } else {
                User.findOne({email: req.body.email}).then((user) => {
                    if (user) {
                        res.status(400).json({errors: ["Email already exists."]});
                    } else {
                        const newUser = new User({
                            username: req.body.username,
                            email: req.body.email,
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            age: req.body.age,
                            contact: req.body.contact,
                            password: req.body.password
                        });

                        bcrypt.genSalt(10, (errors, salt) => {
                            bcrypt.hash(newUser.password, salt, (errors, hash) => {
                                if (errors)
                                    throw errors
                                newUser.password = hash;
                                newUser.save().then((user) => res.json(user)).catch(err => console.log(err));
                                const token = jwt.sign({username: newUser._id}, process.env.SECRET_AUTH_TOKEN)
                                return res.header('x-auth-token', token).json(newUser);
                            });
                        });
                    }
                    ;
                });
            }
        });
    });

userRouter.post("/login",
    body('username').isLength({min: 1, max: 255}),
    body('password').isLength({min: 4, max: 50}),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

        User.findOne({username: req.body.username}).then((user) => {
            if (user) {
                // check password hash
                try {
                    bcrypt.compare(req.body.password, user.password).then((result) => {
                        if (result) {
                            console.log("Login successful")
                            const token = jwt.sign({id: user._id}, process.env.SECRET_AUTH_TOKEN)

                            return res.setHeader('x-auth-token', token).send();
                        } else {
                            return res.status(400).json({errors: ["Incorrect password."]})
                        }
                    })
                } catch {
                    return res.status(500).send()
                }
            } else {
                return res.status(400).json({errors: ["User not found."]})
            }
        })
    });

userRouter.get('/info',
    AuthenticateToken,
    (req, res) => {
        const token = req.headers['x-auth-token'];
        // parse token
        const body = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

        User.findOne({_id: body.id}).populate('followers', 'username').populate('following', 'username').exec(function(err, user)  {
            if (err) console.log(err);
            if (user) {
                console.log(user)
                return res.status(200).json(user);
            } else {
                console.log("uhoh.")
                return res.status(404).send();
            }
        });
    });

userRouter.post('/update',
    body('username').isLength({min: 1, max: 255}),
    body('password').isLength({min: 4, max: 50}),
    body('contact').isNumeric(),
    body('age').isNumeric(),
    AuthenticateToken,
    (req, res) => {
        User.updateOne({email: req.body.email}, req.body).then((err, docs) => {
            if (err) return res.status(500).json({error: err});
            return res.status(200).send("Successfully updated.");
        });
    })

module.exports = userRouter;