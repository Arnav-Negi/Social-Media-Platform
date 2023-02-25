const express = require('express');
const cors = require('cors');
const {mongoose} = require("mongoose");
require('dotenv').config()
const authenticateToken = require('./auth/auth')

const app = express();
app.use(express.json());

const corsOptions = {
    exposedHeaders: "x-auth-token"
}
app.use(cors(corsOptions));
app.options('*', cors());

const userRouter = require('./routes/api/users')
app.use('/users', userRouter);
const followRouter = require('./routes/api/follow')
app.use('/follow', followRouter);
const subgreddiitRouter = require('./routes/api/subgreddiit')
app.use('/subg', subgreddiitRouter);
const postsRouter = require('./routes/api/posts')
app.use('/posts', postsRouter);
const reportRouter = require('./routes/api/reports')
app.use('/report', reportRouter);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}).catch(err => console.log(err));

//test routes
app.get('/posts', authenticateToken, (req, res) => {
    res.send("auth granted")
})