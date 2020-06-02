const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSchema = new Schema({
    question:{
        type:String,
        required:true
    },
    optionone:
    {
        type:String,
        required:true
    },
    optiontwo:
    {
        type:String,
        required:true
    },
    optionthree:
    {
        type:String,
        required:true
    },
    optionfour:
    {
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    },
    userId:
    {
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    date: { type: Date, default: Date.now },
    dateinseconds:{type:Number,required:true}
});

module.exports = mongoose.model('test', testSchema);