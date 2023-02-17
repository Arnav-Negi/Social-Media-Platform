const mongoose = require('mongoose')
const User = require('../../models/User');
const Subgreddiit = require('../../models/Subgreddiit');

const express = require('express');
const subgreddiitRouter = express.Router();
const authenticateToken = require('../../auth/auth');
const {body, validationResult} = require("express-validator");

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

        Subgreddiit.findOne({name: req.body.name}).then((sub) => {
            if (sub)
                return res.status(400).send("Subgreddiit name already exists.");
        })
        console.log( req.body.bannedWords);
        const newSub = new Subgreddiit({
            name: req.body.name,
            desc: req.body.desc,
            tags: req.body.tags,
            bannedWords: req.body.bannedWords,
            moderator: body.id,
            members: [body.id],
            posts: []
        });

        newSub.save().then((sub) => console.log("Printing sub", sub)).catch((err) => console.log("Error: ", err));

        return res.status(400);
    });

// All subgreddiits
subgreddiitRouter.get('/',
    authenticateToken,
    (req, res) => {
        const body = req.user;

        Subgreddiit.find().then((all) => {
            return res.status(200).json(all)
        }).catch(err => console.log(err));

        return res.status(400);
    })

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

module.exports = subgreddiitRouter;