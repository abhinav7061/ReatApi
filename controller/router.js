const User = require("../models/userSchema");
const getHomepage = async (req, res) => {
    const { email, password, sort, select } = req.query; //for the quering options
    const queryObj = {};

    if (email) {
        queryObj.email = email;
    }
    if (password) {
        queryObj.password = { $regex: password, $options: 'i' }; //options "i" is for case insensitive
    }

    let page = Number(req.query.page);
    let limit = Number(req.query.limit);
    let skip = (page - 1) * limit;
    console.log("limit is " + limit + " and page is " + page);
    let allUsers = User.find(queryObj).skip(skip).limit(limit);

    if (sort) {
        console.log(sort);
        let sortData = sort.split(",").join(" ");
        allUsers = allUsers.sort(sortData);
    }

    if (select) {
        console.log(sort);
        let selectedData = select.split(",").join(" ")
        allUsers = allUsers.select(selectedData);
    }

    const queryedUsers = await allUsers;
    res.status(200).json({ "AllTheData": queryedUsers, "total no of data": queryedUsers.length });
}

const getProfile = async (req, res) => {
    const token = req.cookies;
    console.log(token);
    jwt.verify(token, process.env.SECRET_KEY, {}, (err, info) => {
        if (err) throw err;
        console.log(info);
        res.status(201).json(info);
    });
}

const getRegister = async (req, res) => {
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
}

const getLogin = async (req, res) => {
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

                res.send("token htggn: " + token);
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
}

const getErrorpage = async (req, res) => {
    res.send('Error: 404 page not found');
}

module.exports = { getHomepage, getRegister, getLogin, getProfile, getErrorpage };