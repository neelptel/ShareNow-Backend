const express = require("express");
const app = express();
const path = require('path');
const cors = require('cors');

app.use(
    cors({
        origin: "http://127.0.0.1:3003/"
    })
);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('views'));

const connectDB = require("./db");
connectDB();

//template Engine

app.set('views', path.join(__dirname,'/views'));
app.set('view engine', 'ejs');

//Initializing Routes

app.use('/files',require('./routes/files'));
app.use('/',require('./routes/show'));
app.use('/files/download',require('./routes/download.js'))

app.listen(PORT, ()=>{
    console.log(`Listining port ${PORT}`);
})

