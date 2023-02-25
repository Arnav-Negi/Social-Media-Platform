const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {body, validationResult} = require("express-validator");
const AuthenticateToken = require('../../auth/auth');

// Load User model
const User = require("../../models/User");
const Post = require("../../models/Post");

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
        User.findOne({_id: req.user.id}).populate(
            'followers', 'username').populate(
                'following', 'username').populate(
                'subgreddiits').populate({
            path: 'savedPosts',
            populate: {
                path: 'poster',
                model: 'user'
            }
        })
            .exec(function(err, user)  {
            if (err) console.log(err);
            if (user) {
                console.log(user)
                return res.status(200).json(user);
            } else {
                return res.status(404).send("user not found.");
            }
        });
    });

userRouter.post('/update',
    AuthenticateToken,
    body('username').isLength({min: 1, max: 255}),
    body('password').isLength({min: 4, max: 50}),
    body('contact').isNumeric(),
    body('age').isNumeric(),
    (req, res) => {
        User.findOne({_id: req.user.id}).then((user) => {

            if (!user) return res.status(404);

            user._doc = {...user._doc,  ...req.body};
            user.save().then((user)=> {
                return res.status(200).json(user)
            }).catch(
                err=>{return res.status(500).json(err)}
            );
        }).catch(err=> {
            return res.status(400).json(err)
        });
    })

userRouter.post('/save',
    AuthenticateToken,
    (req, res) => {
        const userid = req.user.id;
        Post.findOne({_id: req.body.post}).then(post => {
            User.findOne({_id: userid}).then(user => {
                if (!user.savedPosts.includes(req.body.post)) {
                    User.updateOne({_id: userid}, {
                        $push: {
                            savedPosts: req.body.post
                        }
                    }).then((user) => {
                        return res.status(200).json(user);
                    }).catch(err => {
                        return res.status(500).json(err)
                    })
                }
                else {
                    User.updateOne({_id: userid}, {
                        $pull: {
                            savedPosts: req.body.post
                        }
                    }).then((user) => {
                        return res.status(200).json(user);
                    }).catch(err => {
                        return res.status(500).json(err)
                    })
                }
            }).catch(err => {
                return res.status(500).json(err);
            })
        }).catch(err => {
            return res.status(400).json(err);
        })
    });

module.exports = userRouter;