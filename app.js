const express = require('express');
const app = express();
const routes = require('./Routes');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json())
app.use(routes);

console.log(process.env.NODE_ENV);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0-5eb4q.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`)
.then(result => {
    app.listen(process.env.PORT || 3300);
})
.catch(err => {
    console.log(err);
})


