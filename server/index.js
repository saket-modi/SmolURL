// ref: https://bytebytego.com/courses/system-design-interview/design-a-url-shortener
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const { lookUp, createEntry } = require('./database');
const { verifyUrl, sanitizeUrl } = require('./util');

app.use(express.json());
app.use(cors({
    origin: `http://localhost:5173`
}));

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
app.post('/api/:uri', async (req, res) => {
    // handles requests where the uri already exists in db
    var targetUrl = verifyUrl(req.params.uri);
    if (!targetUrl) {
        // bad url
        return res.status(400).send(`misformatted url or destination does not exist.`);
    }
    const urlEntry = await createEntry(targetUrl);
    return res.status(201).json(urlEntry);
});

// redirect short to long url
app.get('/api/:uri', async (req, res) => {
    const urlEntry = await lookUp(req.params.uri);
    if (!urlEntry) {
        return res.status(404).send(`URL not found.`);
    }

    var targetUrl = sanitizeUrl(urlEntry.url);

    // status codes: 301 -> permanently moved => cache the actual long url in the browser
    // 302 -> temp moved; go through the shortening service
    return res.redirect(302, targetUrl);
});

const PORT = process.env.PORT || 4857;
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});