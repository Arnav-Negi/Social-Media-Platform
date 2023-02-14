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

                follower.following.splice(followidx, 1)
                user.followers.splice(useridx, 1)

                follower.save().then((flw) => {
                    console.log("follower saved")
                }).catch(err => console.log(err))
                user.save().then((flw) => {
                    console.log("user saved")
                }).catch(err => console.log(err))
                return res.status(200).json(user);
            })
        }).catch(err => console.log(err))
    })

module.exports = followRouter;