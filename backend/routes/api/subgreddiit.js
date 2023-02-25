const mongoose = require('mongoose')
const User = require('../../models/User');
const Subgreddiit = require('../../models/Subgreddiit');
const Report = require('../../models/Report');

const express = require('express');
const subgreddiitRouter = express.Router();
const authenticateToken = require('../../auth/auth');
const {body, validationResult} = require("express-validator");
const moment = require("moment");
const {model} = require("mongoose");

subgreddiitRouter.post('/',
    authenticateToken,
    body('name').trim().isLength({min: 1}),
    body('bannedWords').toArray(),
    body('tags').toArray(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({errors: errors.array()})
        }
        const body = req.user;

        for (let i = 0; i < req.body.bannedWords.length; i++) {
            req.body.bannedWords[i] = req.body.bannedWords[i].toLowerCase();
            req.body.bannedWords[i].trim();
            if (req.body.bannedWords[i].indexOf(' ') >= 0) return res.status(400).send("Banned words should be single words.");
        }

        for (let i = 0; i < req.body.tags.length; i++) {
            req.body.tags[i].trim();
            if (req.body.tags[i].indexOf(' ') >= 0) return res.status(400).send("Tags should be single words.");
        }

        if (req.body.name.includes(' ')) res.status(400).send("Name should not contain spaces.");

        Subgreddiit.findOne({name: req.body.name}).then((sub) => {
            if (sub)
                return res.status(400).send("Subgreddiit name already exists.");
        })

        const newSub = new Subgreddiit({
            name: req.body.name,
            desc: req.body.desc,
            tags: req.body.tags,
            bannedWords: req.body.bannedWords,
            moderator: body.id,
            members: [body.id],
            posts: [],
            createdAt: moment().format("YYYYMMDD"),
            joinReqs: [],
            banned: []
        });

        newSub.save().then((sub) => {
            console.log("Printing sub", sub);
             return res.status(200).json(sub);
        }).catch((err) => console.log("Error: ", err));

        return res.status(400);
    });

// All subgreddiits
subgreddiitRouter.get('/all',
    authenticateToken,
    (req, res) => {
        const body = req.user;

        Subgreddiit.find().then((all) => {
            return res.status(200).json(all)
        }).catch(err => console.log(err));

        return res.status(400);
    })

subgreddiitRouter.get('/:id',
    authenticateToken,
    (req, res) => {
        const body = req.user;
        const id = req.params.id;

        Subgreddiit.findOne({_id: id}).populate({
            path: 'posts',
            populate: {
                path: 'poster',
                model: 'user'
            }
        }).populate('members').populate('joinReqs').populate({
            path: 'reports',
            populate: [{
                path: 'post',
                model: 'post'
            }, {
                path: 'reported',
                model: 'user'
            }, {
                path: 'reportedBy',
                model: 'user'
            }]
        }).then((sub) => {
            let reportList = []
            for (let i = 0; i < sub.reports.length; i++) {
                if (moment().diff(moment(sub.reports[i].createdAt, 'YYYYMMDD'), 'days') >= 10) {
                    Report.findOne({_id: sub.reports[i]}).deleteOne();
                }
                else {
                    reportList.push(sub.reports[i]._id);
                }
            }
            Subgreddiit.updateOne({_id: id}, {reports: reportList});
            return res.status(200).json(sub)
        }).catch(err => console.log(err));

        return res.status(400);
    });

subgreddiitRouter.post('/remove',
    authenticateToken,
    (req, res) => {

        Subgreddiit.findOne({name: req.body.name}).then((sub) => {
            if (!sub) return res.status(404).send("Subgreddiit not found.")
            console.log(sub.moderator + ":" + req.user.id);
            if (sub.moderator != req.user.id) return res.status(401).send("Unauthorized.")

            sub.remove().then((sub) => {
                return res.status(200).json(sub);
            }).catch(err => console.log(err));
        })
    })

subgreddiitRouter.post('/join',
    authenticateToken,
    (req, res) => {
        const userId = req.user.id;
        Subgreddiit.findOne({_id: req.body.sgID}).then((sg) => {
            if (!sg) return res.status(404).send("SG not found.");

            const index = sg.members.indexOf(userId);
            if (index !== -1) {
                return res.status(400).send("Already a member.");
            } else {
                if (sg.banned.includes(userId)) return res.status(400).send("User is banned from subgreddiit.")
                if (!sg.joinReqs.includes(userId)) {
                    Subgreddiit.updateOne({_id: req.body.sgID},
                        {
                            $push: {joinReqs: userId}
                        }).then(sg => {
                        return res.status(200).json(sg);
                    }).catch(err => {
                        return res.status(500).json(err);
                    });
                } else
                    return res.status(400).send("Join request already sent.");
            }
        }).catch(err => {
            return res.status(500).json(err);
        })
    })

subgreddiitRouter.post('/leave',
    authenticateToken,
    (req, res) => {
        const userId = req.user.id;
        Subgreddiit.findOne({_id: req.body.sgID}).then((sg) => {
            if (!sg) return res.status(404).send("SG not found.");

            const index = sg.members.indexOf(userId);
            if (index === -1) {
                return res.status(400).send("Not a member.");
            } else {
                if (sg.moderator == userId) return res.status(400).send("Mods cant leave subgreddiits.");

                Subgreddiit.updateOne({_id: req.body.sgID},
                    {
                        $pull: {members: userId},
                        $push: {banned: userId}
                    }).then(sg => {
                    return res.status(200).json(sg);
                }).catch(err => {
                    return res.status(500).json(err)
                });
                return res.status(400).send("Join request already sent.");
            }
        }).catch(err => {
            return res.status(500).json(err);
        })
    })

subgreddiitRouter.post('/resolve',
    authenticateToken,
    (req, res) => {
        const userid = req.user.id;
        Subgreddiit.findOne({_id: req.body.subgreddiit}).then(sg => {
            if (sg.moderator != userid) {
                return res.status(400).send("Not a moderator.");
            }

            if (!sg.joinReqs.includes(req.body.joining)) return res.status(400).send("User has not requested to join.");

            if (req.body.action === "accept") {
                Subgreddiit.updateOne({_id: req.body.subgreddiit}, {
                    $pull: {
                        joinReqs: req.body.joining
                    },
                    $push: {
                        members: req.body.joining
                    }
                }).then(sg => {
                    return res.status(200).json(sg);
                }).catch(err => {
                    return res.status(400).json(err);
                })
            }
            else if (req.body.action === "reject") {
                Subgreddiit.updateOne({_id: req.body.subgreddiit}, {
                    $pull: {
                        joinReqs: req.body.joining
                    }
                }).then(sg => {
                    return res.status(200).json(sg);
                }).catch(err => {
                    return res.status(400).json(err);
                })
            }
            else return res.status(400).send("Unidentified action");
        }).catch(err => {
            return res.status(400).json(err);
        });
    })

module.exports = subgreddiitRouter;
