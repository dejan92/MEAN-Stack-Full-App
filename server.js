const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const appRoutes = require('./app/routes/api');
const path = require('path');

const port = process.env.port || 5000
const app = express();

//adding middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/public'))); 
app.use('/api', appRoutes);

//connection to database
mongoose.connect('mongodb://localhost:27017/mean-full-app', {
    useNewUrlParser: true
}, (err) => {
    if (err) {
        console.log('Not connected to database', err);
    } else {
        console.log('Successfully connected to MondoDB');
    }
});

app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname, '/public/app/views/index.html'));
})

//initializing the server
app.listen(port, () => {
    console.log(`Server started on port : ${port} `);
});