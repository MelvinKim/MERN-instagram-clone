const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const crypto = require('crypto');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');
const requireLogin  = require('../middleware/requireLogin');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

// router.get('/protected', requireLogin, (req, res, next) => {
//     res.send('Hello user')
// })


router.post('/signup', (req, res) => {
    const {name, email, password, pic} = req.body;
    if(!email || !password || !name){
       return res.status(422).json({ error: 'Please add all the fields'})
    } 
   User.findOne({email: email})
   .then((savedUser) => {
       if(savedUser){
           return res.status(422).json({ error: 'user already exists'});
       }
       bcrypt.hash(password, 15)
       .then(hashedPassword => {
           const user = new User ({
               email: email,
               name: name,
               password: hashedPassword,
               pic:pic
           })
           user.save()
           .then(user => {
               transporter.sendMail({
                   to: user.email,
                   from:"melobruk1@gmail.com",
                   subject: 'Signup successful',
                   html:"<h1>Welcome to Instagram Clone</h1>"
               }).then(emailSent => {
                   res.json({ message: 'User Saved successfully'})
               }).catch(err => {
                   res.json({error : "Error while sending email"+err})
                   console.log(err)
               })
           })
           .catch(err => {
               console.log(err)
           })
       })
   })
   .catch(err => {
       console.log(err)
   })
})

router.post('/signin', (req, res) => {
    // console.log(req.headers);
    const { email, password } = req.body;
    if( !email || !password ){
       return res.status(422).json({ error: 'Please provide all the details'})
    }
    User.findOne({ email: email})
    .then(savedUser => {
        if(!savedUser){
          return res.status(404).json({ error: "Invalid credentials" });
        }
        //compare the passwords
        bcrypt.compare(password, savedUser.password)
             .then( doMatch => {
                 if(doMatch){
                    //  return res.json({ message: 'Successfully signed in '})
                    const token = jwt.sign({ _id: savedUser._id}, JWT_SECRET);
                    const {_id, name, email, followers, following, pic} = savedUser;
                    return res.json({ token: token, user:{ _id, name,email,followers, following,pic, password}})
                 }
                 return res
                   .status(404)
                   .json({ error: "Invalid email or password" });
             })
             .catch(err => {
                 console.log('error'+err)
             })
    })
})

router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex");
        console.log(token)
        User.findOne({ email: req.body.email})
        .then(user => {
            if(!user){
                return res.status(404).json({ error: "User doesn't exist"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save()
            .then((result) => {
                transporter.sendMail({
                    to: user.email,
                    from:"melobruk1@gmail.com",
                    subject: "Password Reset",
                    // remember to change while deploying the url
                    html: `
                    <p>You requested for password reset</p>
                    <h6>Click <a href='http://localhost:3000/reset/${token}'>here</a> to proceed</h6>
                    `
                }).then(email => {
                    res.json({ message:`Reset link set to ${user.email}`})
                })
                .catch(err => {
                    console.log(err)
                })
            })
        })
    })
})

router.post('/new-password', (req, res) => {
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    User.findOne({ resetToken: sentToken, expireToken:{$gt: Date.now()}})
    .then(user => {
        if(!user){
            return res.status(422).json({ error: "Try again Session expired"})
        }
        bcrypt.hash(newPassword, 15)
        .then(hashedPassword => {
            user.password = hashedPassword;
            user.resetToken = undefined;
            user.expireToken = undefined;
            user.save().then(user => {
                res.json({ message: "Password updated Successfully"})
            })
        })
    })
    .catch(err => {
        console.log(err)
    })
});
module.exports = router;