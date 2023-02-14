const mongoose = require('mongoose')
const User = require('../../models/User');
const Subgreddiit = require('../../models/Subgreddiit');

const express = require('express');
const subgreddiitRouter = express.Router();
const authenticateToken = require('../../auth/auth');
const {body, validationResult} = require("express-validator");


subgreddiitRouter.post('/',
    authenticateToken,
    body('name').isLength({min: 1}),
    body('bannedWords').custom((value) => {
        for (let i = 0; i < value.length; i++) {
            if (value[i].indexOf(" ") >= 0) return false;
        }
        return true;
    }),
    body('tags').custom((value) => {
        for (let i = 0; i < value.length; i++) {
            if (value[i].indexOf(" ") >= 0) return false;
        }
        return true;
    }),
    body('bannedWords').customSanitizer((value) => {
        for (let i = 0; i < value.length; i++) {
            value[i] = value[i].toLowerCase();
        }
        return value;
    }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({errors: errors.array()})
        }
        const body = req.user;

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
            posts: []
        });

        newSub.save().then((sub) => console.log("Printing sub", sub)).catch((err) => console.log("Error: ", err));

        User.findOne({_id: body.id}).then((user) => {
            User.updateOne({_id: body.id}, {subgreddiits: [...user.subgreddiits, newSub._id]}).then((users) => {
                if (users) return res.status(200).json(newSub);
            }).catch((err) => console.log(err));
        }).catch(err => console.log(err));

        return res.status(400);
    })

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

module.exports = subgreddiitRouter;