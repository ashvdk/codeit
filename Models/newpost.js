const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newpostSchema = new Schema({
    testId:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('newpost', newpostSchema);