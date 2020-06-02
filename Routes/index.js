const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Company = require('../Models/company')
const User = require('../Models/user')
const Follower = require('../Models/followers')
const Test = require('../Models/test')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const codeResult = require('../Userfiles')
const fs = require('fs');
const followHim = require('../Controller/Followhim')
const saveuseractivity = require('../Controller/Saveuseractivity')

const Newpost = require('../Models/newpost')
const Saveuseractivity = require('../Models/saveuseractivity')
// const Cat = mongoose.model('Cat', { name: String });
// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));
// res.send('<h1>Route is working</h1>');
const checkToken = (req, res, next) => {
    const header = req.headers['authorization'];
    if(typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];

        req.token = token;
        next();
    } else {
        //If header is undefined return Forbidden (403)
        res.sendStatus(403)
    }
}
app.post('/follow',checkToken,followHim);
app.post('/checkifheisurfriend',checkToken,(req,res)=>{
    const {friendUserId} = req.body;
    console.log(friendUserId)
    const decode = jwt.verify(req.token, 'ednu454@%kljfdlfbBKJGGKFJN');
    const userId = decode.userId;
    Follower.findOne({userId,followersUserId:friendUserId})
    .then(follower => {
        follower ? res.send("yes") : res.send("no")
    })
})
app.post('/saveuseractivity',checkToken,saveuseractivity);
app.get('/getallposts',checkToken,(req,res)=>{
    const lastloggedintime = req.query.lastloggedintime;
    const decode = jwt.verify(req.token, 'ednu454@%kljfdlfbBKJGGKFJN');
    const userId = decode.userId;
    Follower.find({userId:userId})
    .then(docs =>{
        let follwers = docs.map(doc => {
            return doc.followersUserId;
        })
        Test.find({
            userId:{$in: follwers},
            dateinseconds: { $gt: lastloggedintime }
        })
        .populate('userId')
        .limit(10)
        .then(alltests => {
            res.send(alltests);
        })
    })
})
app.get('/getfollowers',checkToken,(req,res)=>{
    const decode = jwt.verify(req.token, 'ednu454@%kljfdlfbBKJGGKFJN');
    const userId = decode.userId;
    Follower.find({userId:userId}).populate('followersUserId')
    .then(docs =>{
        res.send(docs);
    })
})
app.get('/getQuestionsForTheParticularUser',checkToken,(req,res)=>{
    const decode = jwt.verify(req.token, 'ednu454@%kljfdlfbBKJGGKFJN');
    const userId = decode.userId;
    Test.findOne({userId:req.query.followersUserId})
    .then(doc =>{
        res.send(doc);
    })
})
app.get('/getUserDetails',checkToken,(req,res)=>{
    const decode = jwt.verify(req.token, 'ednu454@%kljfdlfbBKJGGKFJN');
    const userId = decode.userId;
    User.findOne({_id:userId})
    .then(doc => {
        if(doc)
        {
            res.status(200).json({dateinseconds:doc.dateinseconds})
        }
    })
})
app.get('/websocket',(req,res)=>{
    console.log("we are here")
});
app.post('/signup',(req,res)=>{
    const {email,password} = req.body;
    let dateInMillisecs = Date.now()
    let dateinseconds = Math.round(dateInMillisecs/1000);
    if(email && password)
    {
        User.findOne({email:email})
        .then(user => {
            if(user)
            {
                res.status(401).send("Email in use!!");
            }
            else
            {
                bcrypt.hash(password,10,function(err, hash) {
                    const user = new User({
                        email:email,
                        password:hash,
                        dateinseconds
                    })
                    user.save()
                    .then(result => {
                        const token = jwt.sign(
                            {
                                email:result.email,
                                userId:result._id.toString()
                            },
                            'ednu454@%kljfdlfbBKJGGKFJN',
                            {expiresIn:'1h'}
                        );
                        res.status(201).json({token:token,dateinseconds:result.dateinseconds})
                    })
                });
            }
        })
    }
    else
    {
        res.status(401).send("Incorrect username or password");
    }
})
app.post('/savethetest',checkToken,(req,res)=>{
    const {question,optionone,optiontwo,optionthree,optionfour,answer,dateinseconds} = req.body;
    console.log(req.token)
    const decode = jwt.verify(req.token, 'ednu454@%kljfdlfbBKJGGKFJN');
    console.log(decode.userId);
    const userId = decode.userId;
    const test = new Test({
        question,
        optionone,
        optiontwo,
        optionthree,
        optionfour,
        answer,
        userId,
        dateinseconds
    })
    test.save()
    .then(result => {
        console.log("saved");
        res.status(200).send(result);
        // const newpost = new Newpost({
        //     testId:result._id,
        //     userId:userId
        // })
        // newpost.save().then(secondResult => {
        //     res.status(200).send(result);
        // })
    })
    .catch(err => {
        console.log("didnt save");
        res.send("didnt save");
    })
});
app.post('/getalltest',checkToken,(req,res)=>{
    const decode = jwt.verify(req.token, 'ednu454@%kljfdlfbBKJGGKFJN');
    const userId = decode.userId;
    Test.find({userId:userId},function(err,docs){
        res.send(docs)
    })
});
app.get('/getnames',checkToken,(req,res)=>{
    const {email} = req.query;
    const decode = jwt.verify(req.token, 'ednu454@%kljfdlfbBKJGGKFJN');
    const userId = decode.userId;
    User.find({email:{ $regex:email, $options: 'i' },_id:{$ne : userId}})
    .then(user => res.send(user))
    // res.send("came tilll here");
});
app.post('/login',(req,res)=>{
    const {email,password} = req.body;
    let myUser;
    if(email && password)
    {
        User.findOne({email:email})
        .then(user => {
            if(user)
            {
                myUser = user;
                bcrypt.compare(password,user.password).then(isEqual => {
                    if(isEqual)
                    {
                        const token = jwt.sign(
                            {
                                email:myUser.email,
                                userId:myUser._id.toString()
                            },
                            'ednu454@%kljfdlfbBKJGGKFJN',
                            {expiresIn:'1h'}
                        );
                        res.status(200).json({token:token,dateinseconds:myUser.dateinseconds})
                    }
                    else{
                        res.status(401).send("Incorrect username or password");
                    }
                })
            }
            else
            {
                res.status(401).send("Incorrect username or password");
            }
        })
    }
    else
    {
        res.status(401).send("Incorrect username or password");
    }
})

app.post('/companyregister',(req,res)=>{
    const {companyName,locality,city,state} = req.body;
    Company.findOne({ 'companyName': companyName },(err,result)=>{
        if(result) {
            console.log("its there");
            res.send("its there");
        }
        else
        {
            const company = new Company({companyName,locality,city,state});
            company.save().then(() => res.send("saved"));
        }
    })
});
app.get('/getcompanies',(req,res)=>{
    Company.find({locality:req.query.locality},(err,result)=>{
        if(result){ 
            //console.log(result) 
            res.send(result);
        }else
        {
            res.send("Not Found");
        }
    })
    //console.log(req.query);
})

module.exports = app;