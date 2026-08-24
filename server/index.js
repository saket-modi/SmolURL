// ref: https://bytebytego.com/courses/system-design-interview/design-a-url-shortener
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { lookUp, createEntry } = require('./database');

app.use(express.json());

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_KEY);
        console.log("connected to mongodb!");
    } catch(err) {
        console.log("error:" , err.message);
    }
}
connectDB();

app.post('/api/create/:uri', async (req, res) => {
    const urlEntry = await createEntry(req.params.uri);
    res.status(201);
    res.json(urlEntry);
});

app.get('/api/url/:uri', async (req, res) => {
    const urlEntry = await lookUp(req.params.uri);
    res.status(301);
    // status codes: 301 -> permanently moved => cache the actual long url in the browser
    // 302 -> temp moved; go through the shortening service
    res.json(urlEntry);
});