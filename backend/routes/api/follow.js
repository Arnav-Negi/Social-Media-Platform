const mongoose = require('mongoose');
User = require('../../models/User');
const express = require('express');
followRouter = express.Router();
const AuthenticateToken = require('../../auth/auth');

followRouter.post('/',
    AuthenticateToken,
    (req, res) => {
        User.findOne({_id: req.user.id}).then((user) => {
                if (!user) return res.status(400).send("Follower not found.");
                User.findOne({username: req.body.following}).then((following) => {
                        if (!following) return res.status(400).send("User not found.");

                        const idx = user.following.indexOf(following._id);
                        if (idx === -1) {
                            User.updateOne({_id: user._id}, {
                                $push: {
                                    following: following._id
                                }
                            }).then((docs) => {
                                User.updateOne({_id: following._id}, {
                                    $push: {
                                        followers: user._id
                                    }
                                }).then((docs) => {
                                    return res.status(200).send("following toggled.");
                                })
                            });

                        } else {
                            User.updateOne({_id: user._id}, {
                                $pull: {
                                    following: following._id
                                }
                            }).then((docs) => {
                                User.updateOne({_id: following._id}, {
                                    $pull: {
                                        followers: user._id
                                    }
                                }).then((docs) => {
                                    return res.status(200).send("following toggled.");
                                })
                            });
                        }
                    }
                )
            }
        )
    })

followRouter.post('/remove',
    AuthenticateToken,
    (req, res) => {
        User.findOne({_id: req.user.id}).then((user) => {
            if (!user) return res.status(400).send("User not found.")

            User.findOne({username: req.body.follower}).then((follower) => {
                if (!follower) return res.status(400).send("Follower not found.")

                const followidx = follower.following.indexOf(user._id)
                if (followidx == -1) return res.status(400).send("User doesn't follow you.")
                const useridx = user.followers.indexOf(follower._id)
                if (useridx == -1) return res.status(500).send()

                User.updateOne({_id: user._id}, {
                    $pull: {
                        followers: follower._id
                    }
                }).then(docs => {
                    User.updateOne({_id: follower._id}, {
                        $pull: {
                            following: user._id
                        }
                    }).then(docs => {
                        return res.status(200).send();
                    });
                });
            })
        }).catch(err => console.log(err))
    })

module.exports = followRouter;