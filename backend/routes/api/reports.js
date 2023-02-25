const mongoose = require('mongoose')
const User = require('../../models/User');
const Subgreddiit = require('../../models/Subgreddiit');
const Report = require('../../models/Report');
const Post = require('../../models/Post');
const express = require('express');
const reportRouter = express.Router();
const authenticateToken = require('../../auth/auth');
const {body, validationResult} = require("express-validator");
const moment = require("moment");

reportRouter.post('/',
    authenticateToken,
    (req, res) => {
        const userid = req.user.id;

        Post.findOne({_id: req.body.post}).then(post => {
            const newReport = new Report({
                reported: post.poster,
                reportedBy: userid,
                post: post._id,
                concern: req.body.concern,
                subgreddiit: post.subgreddiit,
                createdAt: moment().format("YYYYMMDD"),
                ignored: false
            });

            newReport.save().then(report => {
                Subgreddiit.updateOne({_id: post.subgreddiit}, {
                    $push: {
                        reports: report._id
                    }
                }).then(sg => console.log(sg)).catch(err => console.log(err));
                return res.status(200).json(report);
            }).catch(err => {
                console.log(err);
                return res.status(400).json(err)
            });
        }).catch(err => {
            return res.status(400).json(err);
        })
    });

reportRouter.post('/ignore',
    authenticateToken,
    (req, res) => {
        const userid = req.user.id;

        Report.findOne({_id: req.body.report}).populate('subgreddiit',
            'moderator').then((report) => {
            if (report.subgreddiit.moderator != userid) return res.status(400).send("Not a moderator.");

            Report.updateOne({_id: req.body.report}, {
                ignored: true
            }).then(report => {
                return res.status(200).json(report);
            }).catch(err => {
                return res.status(400).json(err)
            });
        }).catch(err => {
            return res.status(400).json(err)
        });
    })

reportRouter.post('/block',
    authenticateToken,
    (req, res) => {
        const userid = req.user.id;

        Report.findOne({_id: req.body.report}).populate('subgreddiit',
            'moderator').then((report) => {
            if (report.subgreddiit.moderator != userid) return res.status(400).send("Not a moderator.");

            Subgreddiit.updateOne({_id: report.subgreddiit._id}, {
                $pull: {
                    members: report.reported
                },
                $push: {
                    blocked: report.reported
                }
            }).then(report => {
                return res.status(200).json(report);
            }).catch(err => {
                return res.status(400).json(err)
            });
        }).catch(err => {
            return res.status(400).json(err)
        });
    })

reportRouter.post('/delete',
    authenticateToken,
    (req, res) => {
        const userid = req.user.id;

        Report.findOne({_id: req.body.report}).populate('subgreddiit',
            'moderator').then((report) => {
            if (report.subgreddiit.moderator != userid) return res.status(400).send("Not a moderator.");

            Post.findOne({_id: report.post}).then(
                post => {
                    post.remove().then(post => {
                        report.remove().then(report => {
                            return res.status(200).json(report);
                        }).catch(err => {
                            return res.status(400).json(err);
                        })
                    }).catch(err => {
                        return res.status(400).json(err);
                    })
                }
            ).catch(err => {
                return res.status(400).json(err)
            });
        }).catch(err => {
            return res.status(400).json(err)
        });
    })

module.exports = reportRouter;
