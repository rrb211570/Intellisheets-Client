const functions = require("firebase-functions");
const express = require("express");
const path = require('path');
const app = express();
const cors = require('cors');
app.use(cors());

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
app.use((req, res, next) => {
    if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
        next();
    } else {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    }
});

app.use(express.static(path.join(__dirname, 'client/build')));

app.use((req, res) => {
    res.status(200).send('Hello, world!');
});

app.get('/test',(req,res)=>{
    res.send("Hooray, it works!");
});

exports.app = functions.https.onRequest(app);
