const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
// const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    resetToken:{
        type: String
    },
    expireToken:{
        type: Date
    },
    pic:{
        type: String,
        default:'https://res.cloudinary.com/dyjp6vejk/image/upload/v1592494180/avatar_py1w7l.jpg'
    },
    followers:[{
        type: ObjectId,
        ref: 'User'
    }],
    following:[{
        type: ObjectId,
        ref: 'User'
    }],
    creationDate: {
        type: Date,
        default: Date.now()
    }
});

 mongoose.model('User', userSchema);