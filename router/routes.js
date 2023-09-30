const express = require('express');
const DbConnection = require('../db/conn');
const User = require("../models/userSchema");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { getHomepage, getRegister, getLogin, getProfile, getErrorpage } = require('../controller/router');
const app = express();
app.use(express.json());
app.use(cookieParser());
const router = express.Router();
DbConnection();  //calling function to connect with database
async function verifyPassword(password, passwordHash) {
    const isPasswordValid = await bcrypt.compare(password, passwordHash);
    return isPasswordValid;
}

router.route('/').get(getHomepage);
router.route('/profile').get(getProfile);

router.route('*').get(getErrorpage);

// signup routes for the new user
router.post('/register', async (req, res) => {
    const { name, email, password, phone, gender } = req.body;
    console.log(req.body);
    if (!name || !email || !password || !phone || !gender) {
        return res.status(422).json({ message: 'pls fill the all required fields' });
    }
    try {
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(422).json({ message: 'User exists' });
        }
        const user = new User({ name, email, password, phone, gender });
        await user.save();  // saving the data of new user
        res.status(201).json({ message: 'user registered' });
    } catch (err) {
        console.log(err);
    }
})

//login route for the user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
        return res.status(422).json({ message: 'pls fill the all required fields' });
    }
    try {
        const user = await User.findOne({ email });
        if (user === null) {
            return res.status(400).send("wrong credentials");

        }
        passwordHash = user.password;
        const isPasswordValid = await verifyPassword(password, passwordHash);

        if (isPasswordValid) {
            const username = email;
            // res.send("successfully logged in");

            //generating the jwt token
            // const token = await user.generateAuthToken();
            console.log("successfully logged in");
            jwt.sign({ username, id: user._id }, process.env.SECRET_KEY, {}, (err, token) => {
                if (err) throw err;

                res.send("token: " + token);
                res.status(201).cookie('jwtToken', token).json({
                    id: userDoc._id,
                    username,
                });
            });
        }
        else {
            res.status(400).send("wrong credentials");
        }
    } catch (error) {
        console.log("error: " + error);
    }
})

module.exports = router;