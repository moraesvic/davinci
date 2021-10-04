const express = require('express');
const path = require('path');

const app = express();

/* MIDDLEWARES */
var cookieParser = require('cookie-parser');
const { exit } = require('process');
app.use(cookieParser());

/* 
* The following is EVERYTHING needed to parse form and fetch input.
* BodyParser was deprecated.
*/
app.use(express.json());
app.use(express.urlencoded( {extended: true }));

/* ENVIRONMENT VARIABLES */

if (__dirname != process.cwd()) {
    console.log("Please assure you are running the server with the correct environment");
    exit();
}

app.set('root', __dirname);

const PUBLIC = path.join(__dirname, 'public/');
app.set('public', PUBLIC);

const mode = app.get("env");
console.log(`Currently running in ${mode} mode`);

const IsProductionMode = mode === "production";

if (!IsProductionMode) {
	/* in production, nginx will serve static files */
	app.use('/static', express.static('public'));
}

const PORT = process.env.PORT || 5000;

/* ROUTERS & API */
require("./src/api.js")(app);

/*
################################################################################
########## CONFIGURE 404 AND START LISTENING
################################################################################
*/

app.use(function(req,res){
    res.status(404).sendFile(PUBLIC + '404.html');
});

app.listen(PORT, function(req,res){
    console.log('Listening on port ' + PORT + '...');
});
