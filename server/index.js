// ref: https://bytebytego.com/courses/system-design-interview/design-a-url-shortener
const express = require('express');
const app = express.app();
const { connectDB, lookUp } = require('./database');

app.post('/api/url/create', (req, res) => {
    /*
        {
            "url": "sharan-deepak.india",
            "short": "sd.india",
            "last-updated": "now"
        }
    */
    const to_encode = req.url;
    // check if it exists as a key in the db
    // if yes -> get -> push to client
    // if no -> push to db -> push to client
});