const jwt = require('jsonwebtoken')


module.exports = authenticateToken = function (req, res, next) {
    const token = req.headers['x-auth-token'];

    if (token == null) {
        res.sendStatus(401);
    } else {
        jwt.verify(token, process.env.SECRET_AUTH_TOKEN, (err, user) => {
            if (err) res.sendStatus(403);

            req.user = user;
            next()
        })
    }
}