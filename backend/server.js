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

const userRouter = require('./routes/api/users')
app.use('/users', userRouter);
const followRouter = require('./routes/api/follow')
app.use('/follow', followRouter);
const subgreddiitRouter = require('./routes/api/subgreddiit')
app.use('/subg', subgreddiitRouter);

// MongoDB uri
const db = require('./config/keys').mongoURL

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(db).then(() => console.log("Connected to MongoDB !")).catch((err) => console.log(err))

// Listen to the port
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

//test routes
app.get('/posts', authenticateToken, (req, res) => {
    res.send("auth granted")
})