const mongoose = require('mongoose');


module.exports = mongoose.model('company', {companyName:String,locality:String,city:String,state:String});