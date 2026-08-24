// ref: https://bytebytego.com/courses/system-design-interview/design-a-url-shortener
const express = require('express');
const app = express.app();
const { connectDB, lookUp, createEntry } = require('./database');

app.post('/api/create/:uri', (req, res) => {
    const urlEntry = await createEntry(req.params.uri);
    return urlEntry;
});