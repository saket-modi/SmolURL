const mongoose = require('mongoose');
require('dotenv').config()
const urlModel = require('./models/url.js')

// exported
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_KEY);
        console.log("connected to mongodb!");
    } catch(err) {
        console.log("error:" , err.message);
    }
}
async function lookUp(url) {
    // look up the url then return if found
    // status codes: 301 -> permanently moved => cache the actual long url in the browser
    // 302 -> temp moved; go through the shortening service
    const urlEntry = await urlModel.find({ "url": url });
    if (!urlEntry) {
        urlEntry = await createEntry(url);
    }
    return urlEntry;
}

// internal
async function createEntry(url) {
    const short = getShortened(url);
    const urlEntry = new urlModel({ "url": url, "short": short});
    return (await urlEntry.save());
}

// url shortening logic
function getShortened(url, chooseHash) {
    if (chooseHash) {
        return getHash(url);
    }
    return getBase62(url);
}

// shortening using hash method + collision resolution (no bloom filter)
function getHash(url) {

}
// shortening using Base62
function getBase62(url) {

}

export default { connectDB, lookUp };