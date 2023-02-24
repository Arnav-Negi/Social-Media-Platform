const mongoose = require('mongoose')
const User = require('../../models/User');
const Subgreddiit = require('../../models/Subgreddiit');
const Post = require('../../models/Post');
const express = require('express');
const postsRouter = express.Router();
const authenticateToken = require('../../auth/auth');
const {body, validationResult} = require("express-validator");
const moment = require("moment");

postsRouter.post('/',
    authenticateToken, // TODO add validation for posts
    (req, res) => {
        const userid = req.user.id;

        Subgreddiit.findOne({_id: req.body.subgreddiit}).then((sg) => {
            if (!sg) return res.status(400).send("Subgreddiit not found.")
            if (!sg.members.includes(userid)) return res.status(400)
                .send("User not member of Subgreddiit");

            const newPost = new Post({
                text: req.body.text,
                poster: userid,
                subgreddiit: sg._id,
                upvoteUsers: [],
                downvoteUsers: [],
                comments: []
            });

            newPost.save().then((post) => {
                if (!post) return res.status(500).send("Couldnt upload post.")

                return res.status(200).json(post);
            }).catch(err => {
                return res.status(500).json(err);
            })
        }).catch(err => {
            return res.status(500).json(err)
        });
    });

postsRouter.post('/upvote',
    authenticateToken,
    (req, res) => {
        const userid = req.user.id;

        Post.findOne({_id: req.body.post}).populate('subgreddiit', 'members').then((post) => {
            if (!post) return res.status(400).send("Post not found.");
            if (!post.subgreddiit.members.includes(userid)) return res.status(400).send(
                "User is not part of subgreddiit."
            );

            const index = post.upvoteUsers.indexOf(userid);
            if (index === -1) {
                Post.updateOne({_id: post._id}, {
                    $push: {
                        upvoteUsers: userid
                    }
                }).then((post) => {
                    return res.status(200).send("Post upvoted.");
                }).catch(err => {
                    return res.status(500).json(err)
                });
            } else {
                Post.updateOne({_id: post._id}, {
                    $pull: {
                        upvoteUsers: userid
                    }
                }).then((post) => {
                    return res.status(200).send("Upvote removed.");
                }).catch(err => {
                    return res.status(500).json(err)
                });
            }
        }).catch(err => {
            return res.status(400).json(err);
        })
    });

postsRouter.post('/downvote',
    authenticateToken,
    (req, res) => {
        const userid = req.user.id;

        Post.findOne({_id: req.body.post}).populate('subgreddiit', 'members').then((post) => {
            if (!post) return res.status(400).send("Post not found.");
            if (!post.subgreddiit.members.includes(userid)) return res.status(400).send(
                "User is not part of subgreddiit."
            );

            const index = post.downvoteUsers.indexOf(userid);
            if (index === -1) {
                Post.updateOne({_id: post._id}, {
                    $push: {
                        downvoteUsers: userid
                    }
                }).then((post) => {
                    return res.status(200).send("Post downvoted.");
                }).catch(err => {
                    return res.status(500).json(err)
                });
            } else {
                Post.updateOne({_id: post._id}, {
                    $pull: {
                        downvoteUsers: userid
                    }
                }).then((post) => {
                    return res.status(200).send("Downvote removed.");
                }).catch(err => {
                    return res.status(500).json(err)
                });
            }
        }).catch(err => {
            return res.status(400).json(err);
        })
    });

postsRouter.post('/comment',
    authenticateToken,
    (req, res) => {
        const userid = req.user.id;

        Post.findOne({_id: req.body.post}).populate(
            'subgreddiit', 'members'
        ).then((post) => {
            if (!post) return res.status(400).send("Post not found.");
            if (!post.subgreddiit.members.includes(userid))
                return res.status(400).send("User not in subgreddiit.")
            Post.updateOne({_id: post._id}, {
                $push: {
                    comments: req.body.text
                }
            }).then((post) => {
                return res.status(200).json(post);
            }).catch(err => {return res.status(500).json(err)});
        }).catch(err => {return res.status(500).json(err)});
    });

module.exports = postsRouter;
