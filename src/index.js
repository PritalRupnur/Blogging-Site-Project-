const express = require('express');
const bodyParser = require('body-parser'); //3rd party middleware
const route = require('./routes/route.js');
const mongoose  = require('mongoose');
const app = express();

app.use(bodyParser.json()); //express methode
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://Prital_FunctionUp:PritalMongoDb@cluster0.ea5ijtv.mongodb.net/Project1-DB?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected")) //return promise by callback function
.catch ( err => console.log(err) )


app.use('/', route) //making all route folder require or global


app.listen(process.env.PORT || 3000, function () { //just a methode app.listen (port ko listen krte h)
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});