const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Company = require('../Models/company')
const User = require('../Models/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const Cat = mongoose.model('Cat', { name: String });
// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));
// res.send('<h1>Route is working</h1>');

app.post('/signup',(req,res)=>{
    const {email,password} = req.body;
    let myUser;
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
                    //res.status(200).json({token:token,userId:myUser._id.toString()})
                    res.status(200).json({token:token})
                }
                else{
                    res.status(401).send("Incorrect username or password");
                }
            })
        }
        else
        {
            bcrypt.hash(password,10,function(err, hash) {
                const user = new User({
                    email:email,
                    password:hash
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
                    res.status(201).json({token:token})
                })
            });
        }
    })
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