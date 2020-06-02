const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followerSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    followersUserId:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('follower', followerSchema);