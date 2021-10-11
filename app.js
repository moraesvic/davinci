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

/* ROUTERS & API */
require("./api/api.js")(app);

if (IsProductionMode) {
    /* Express will serve production assets like main.js
     * or main.css
     *
     * A step even further would be serving these files with
     * nginx, but that will require additional configuration,
     * so let's keep things simple for the moment
     */
    app.use(express.static('client/build'));

    /* If route is not listed (not part of the API), then
     * Express will serve the index.html file
     */
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    })

}

const PORT = process.env.PORT || 5000;

/*
################################################################################
########## CONFIGURE 404 AND START LISTENING
################################################################################
*/

// app.use(function(req,res){
//     console.log(`You are trying to access inexistent resource: ${req.path}`);
//     res.status(404).sendFile(PUBLIC + '404.html');
// });

app.listen(PORT, function(req,res){
    console.log('Listening on port ' + PORT + '...');
});
