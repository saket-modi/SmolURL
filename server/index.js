// ref: https://bytebytego.com/courses/system-design-interview/design-a-url-shortener
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { lookUp, createEntry } = require('./database');

app.use(express.json());

// connect to db
(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_KEY);
        console.log("connected to mongodb!");
    } catch(err) {
        console.log("error:" , err.message);
    }
})();

// health checks
app.get('/api/health', (req, res) => {
    return res.status(200).json({"status": "healthy"});
});

// create new short link
app.post('/api/create/:uri', async (req, res) => {
    const urlEntry = await createEntry(req.params.uri);
    return res.status(201).json(urlEntry);
});

// redirect short to long url
app.get('/api/url/:uri', async (req, res) => {
    const urlEntry = await lookUp(req.params.uri);
    if (!urlEntry) {
        return res.status(404).send(`URL not found.`);
    }

    var targetUrl = urlEntry.url;
    // add http to url if not present
    if (!/^http?:\/\//i.test(targetUrl)) {
        targetUrl = `http://${targetUrl}`;
    }

    // status codes: 301 -> permanently moved => cache the actual long url in the browser
    // 302 -> temp moved; go through the shortening service
    return res.redirect(301, targetUrl);
});

const PORT = process.env.PORT || 4857;
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});