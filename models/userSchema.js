const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {Schema, model} = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, " name is required"]
    },
    email: {
        type: String,
        required: [true, "email  is required"]
    },
    password: {
        type: String,
        required: [true, "password  is required"]
    },
    phone: {
        type: Number,
        required: [true, "phone  is required"]
    },
    gender: {
        type: String,
        required: [true, "gender  is required"]
    },
    created_at: {
        type: Date,
        default: Date.now(), 
    }
})

userSchema.pre('save', async function (next) {
    const saltRounds = 10; // The number of rounds of hashing to use.
    const salt = await bcrypt.genSalt(saltRounds);

    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
})

//generating the jwt token
// userSchema.method.generateAuthToken = async function(){
//     try {
//         let token = jwt.sign({_id: this._id}, process.env.SECRET_KEY)
//     } catch (error) {
        
//     }
// }

const User = model('User', userSchema);

module.exports = User;