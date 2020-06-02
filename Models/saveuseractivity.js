const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const useractivitySchema = new Schema({
    userId:{
        type:String,
        required:true
    },
    dateinseconds: { type: Number, required:true }
});

module.exports = mongoose.model('useractivity', useractivitySchema);