const express = require('express');
const app = express();
const routes = require('./Routes');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');



app.use(cors());
app.use(bodyParser.json())
app.use(routes);


if(process.env.NODE_ENV == "production")
{
    app.use(express.static('code-app/build'));
}


mongoose.connect(`mongodb+srv://ashvdk:I4OqnhVtjKg0q4RJ@cluster0-5eb4q.mongodb.net/test?retryWrites=true&w=majority`)
.then(result => {
    app.listen(process.env.PORT || 3900);
})
.catch(err => {
    console.log(err);
})


