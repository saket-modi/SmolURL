const mongoose = require('mongoose');
require('dotenv').config();
const urlModel = require('./models/url.js');
const crypto = require('node:crypto');

const HASH = true;

// exported
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_KEY);
        console.log("connected to mongodb!");
    } catch(err) {
        console.log("error:" , err.message);
    }
}
async function lookUp(short) {
    // look up the url then return if found
    const urlEntry = await urlModel.find({ "short": short });
    if (!urlEntry) {
        return false;
    }
    return urlEntry;
}

// internal
async function createEntry(url) {
    const nonce = crypto.randomBytes(32).toString('base64');
    const short = getShortened(url, HASH);

    while (lookUp(short)) {
        url += append(nonce);
        short = getShortened(url, HASH);
    }

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
    // CRC32 > MD5 > SHA-1 => use MD5 for integrity check
    return crypto.createHash('md5').update(url).digest('base64').slice(0, 7); // 64 ^ 7 combos
}
// shortening using Base62
function getBase62(url) {

}

export default { connectDB, lookUp };