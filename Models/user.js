const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    dateinseconds: { type: Number, required:true }
});

module.exports = mongoose.model('user', userSchema);