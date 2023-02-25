const mongoose = require('mongoose')
const User = require('../../models/User');
const Subgreddiit = require('../../models/Subgreddiit');
const Post = require('../../models/Post');
const express = require('express');
const postsRouter = express.Router();
const authenticateToken = require('../../auth/auth');
const {body, validationResult} = require("express-validator");
const moment = require("moment");

function censor(req, res, next) {
    let haystack = req.body.text.toLowerCase();

    Subgreddiit.findOne({_id: req.body.subgreddiit}).then(sg => {
        for (let i = 0; i < sg.bannedWords.length; i++) {
            let needle = sg.bannedWords[i].toLowerCase();
            let n = needle.length;

            while (haystack.indexOf(needle) !== -1) {
                let idx = haystack.indexOf(needle);
                if ((idx === 0 || !haystack[idx-1].match(/[a-z]/i)) && (idx + n === haystack.length || !haystack[idx + n].match(/[a-z]/i))) {
                    let temp = req.body.text.substring(0, idx);
                    for (let j = 0; j < n; j++) {
                        temp += '*';
                    }
                    temp += req.body.text.substring(idx + n, req.body.text.length);
                    req.body.text = temp;
                    haystack = temp.toLowerCase();
                }
                else {
                    let temp = req.body.text.substring(0, idx);
                    for (let j = 0; j < n; j++) {
                        temp += '*';
                    }
                    temp += req.body.text.substring(idx + n, req.body.text.length);
                    haystack = temp.toLowerCase();
                }
            }
        }
        next();
    }).catch(err => {
        return res.status(404).send("Subgreddiit not found.")
    });
}

postsRouter.post('/',
    authenticateToken, // TODO add validation for posts
    censor,
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

postsRouter.post('/vote',
    authenticateToken,
    (req, res) => {
        const userid = req.user.id;
        const action = req.body.action; //upvote or downvote
        Post.findOne({_id: req.body.post}).populate('subgreddiit', 'members').then((post) => {
            if (!post) return res.status(400).send("Post not found.");
            if (!post.subgreddiit.members.includes(userid)) return res.status(400).send(
                "User is not part of subgreddiit."
            );

            const indexUp = post.upvoteUsers.indexOf(userid);
            const indexDown = post.downvoteUsers.indexOf(userid);

            // toggle upvote or downvote.
            if (action === "upvote") {
                if (indexUp === -1) {
                    if (indexDown !== -1) Post.updateOne({_id: post._id}, {
                        $pull: {downvoteUsers: userid},
                        $push: {upvoteUsers: userid}
                    }).then(post => {
                        return res.status(200).send()
                    }).catch(err => {
                        return res.status(500).json(err)
                    });

                    else Post.updateOne({_id: post._id}, {
                        $push: {upvoteUsers: userid}
                    }).then(post => {
                        return res.status(200).send()
                    }).catch(err => {
                        return res.status(500).json(err)
                    });
                } else {
                    Post.updateOne({_id: post._id}, {
                        $pull: {upvoteUsers: userid}
                    }).then(post => {
                        return res.status(200).send()
                    }).catch(err => {
                        return res.status(500).json(err)
                    });
                }
            } else if (action === "downvote") {
                if (indexDown === -1) {
                    if (indexUp !== -1) Post.updateOne({_id: post._id}, {
                        $pull: {upvoteUsers: userid},
                        $push: {downvoteUsers: userid}
                    }).then(post => {
                        return res.status(200).send()
                    }).catch(err => {
                        return res.status(500).json(err)
                    });

                    else Post.updateOne({_id: post._id}, {
                        $push: {downvoteUsers: userid}
                    }).then(post => {
                        return res.status(200).send()
                    }).catch(err => {
                        return res.status(500).json(err)
                    });
                } else {
                    Post.updateOne({_id: post._id}, {
                        $pull: {downvoteUsers: userid}
                    }).then(post => {
                        return res.status(200).send()
                    }).catch(err => {
                        return res.status(500).json(err)
                    });
                }
            } else return res.status(400).send();
        }).catch(err => {return res.status(400).json(err)});
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
            }).catch(err => {
                return res.status(500).json(err)
            });
        }).catch(err => {
            return res.status(500).json(err)
        });
    });

module.exports = postsRouter;
