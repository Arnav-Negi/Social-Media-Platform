const express = require('express');
const authenticateToken = require('../../auth/auth');
const Subgreddiit = require('../../models/Subgreddiit');
const {body, validationResult} = require("express-validator");

const subgreddiitRouter = express.Router();

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

        const token = req.headers['x-auth-token'];
        // parse token
        const body = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

        Subgreddiit.findOne({name: req.name}).then((sub) => {
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

        newSub.save().then(
            (sub) => res.status(200).json(sub)
        ).catch(err => res.status(500).send(err));
    })

subgreddiitRouter.get('/',
    authenticateToken,
    (req, res) => {
        const token = req.headers['x-auth-token'];
        // parse token
        const body = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    })

module.exports = subgreddiitRouter;