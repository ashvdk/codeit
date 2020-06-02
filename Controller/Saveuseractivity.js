const jwt = require('jsonwebtoken');
const User = require('../Models/user')

module.exports = (req,res) => {
    const dateinseconds = req.body.dateinseconds;
    const decode = jwt.verify(req.token, 'ednu454@%kljfdlfbBKJGGKFJN');
    const userId = decode.userId;
    console.log(userId,dateinseconds)
    // const useractivity = new Saveuseractivity({
    //     userId,
    //     dateinseconds
    // })
    User.findByIdAndUpdate(userId,{dateinseconds})
    // useractivity.save()
    .then(result => {
        console.log("saved");
        res.status(200).send("saved");
    })
    .catch(err => {
        console.log("didnt save");
        res.send("didnt save");
    })
}