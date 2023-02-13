const express = require('express');
const mongoose = require('mongoose');
const AuthenticateToken = require('../../auth/auth');

followRouter = express.Router();
User = require('../../models/User');

followRouter.post('/',
    AuthenticateToken,
    (req, res) => {
        User.findOne({username: req.body.username}).then((user) => {
                if (!user) return res.status(400).send("Follower not found.");
                User.findOne({username: req.body.following}).then(( following) => {
                        if (!following) return res.status(400).send("User not found.");

                        const idx = user.following.indexOf(following._id);
                        if (idx === -1) {
                            user.following.push(following._id);
                            following.followers.push(user._id);
                        } else {
                            user.following.splice(idx, 1);
                            following.followers.splice(following.followers.indexOf(user._id), 1)
                        }
                        User.updateOne({_id: user._id}, user).then((docs) => {
                            console.log("User updated.")
                        })
                        User.updateOne({_id: following._id}, following).then((docs) => {
                            console.log("followee updated.")
                        })
                        return res.status(200).send("following toggled.")
                    }
                )
            }
        )
    })

module.exports = followRouter;