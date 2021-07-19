if(process.argv[2] === "DEV"){
    console.log('setting the server to run in development mode..');
    process.env.NODE_ENV = "development";
} else{
    console.log('setting the server to run in production mode..');
    process.env.NOED_ENV = 'production';
}

//getting all the required libraries
const path = require('path');
const {readFile,writeFile} = require("fs").promises;
const {htmlParser} = require("node-html-parser");
const nodemailer = require("nodemailer");
const express = require('express');

//setting up the app also to handle post requests
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('./www'));

//setting up the server
let port = process.env.PORT || 5000;
app.listen(port,function(){
    console.log(`server started listening on port ${port}`);
})

//setup the only main get request
app.get("/",function(req,res){
    res.sendFile(path.resolve(__dirname,"./www/index.html"));
})

app.get("/records",function(req,res){
    console.log(req.query);
    console.log('logged app.get(records)');
    res.json({
        recieved: true
    })
})