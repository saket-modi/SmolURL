// ref: https://bytebytego.com/courses/system-design-interview/design-a-url-shortener
const express = require('express');
const app = express.app();
const { connectDB, lookUp, createEntry } = require('./database');

await connectDB();

app.post('/api/create/:uri', (req, res) => {
    const urlEntry = await createEntry(req.params.uri);
    res.status(200);
    return urlEntry;
});

app.get('/api/url/:uri', (req, res) => {
    const urlEntry = await lookUp(req.params.uri);
    res.status(301);
    // status codes: 301 -> permanently moved => cache the actual long url in the browser
    // 302 -> temp moved; go through the shortening service
    return urlEntry.short;
});