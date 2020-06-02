const Follower = require('../Models/followers')
const jwt = require('jsonwebtoken');


module.exports = (req,res) => {
    const followersUserId = req.body.friendUserId;
    const decode = jwt.verify(req.token, 'ednu454@%kljfdlfbBKJGGKFJN');
    const userId = decode.userId;
    const followhim = new Follower({
        userId,
        followersUserId
    })
    followhim.save()
    .then(result => {
        console.log("saved");
        res.status(200).send("saved");
    })
    .catch(err => {
        console.log("didnt save");
        res.send("didnt save");
    })
}