const mongoose = require('mongoose');
require('dotenv').config();
const urlModel = require('./models/url.js');
const crypto = require('node:crypto');

const HASH = true;

// exported
async function lookUp(short) {
    // look up the url then return if found
    const urlEntry = await urlModel.findOne({ "short": short });
    if (!urlEntry) {
        return false;
    }
    return urlEntry;
}

// internal
async function createEntry(url) {
    const nonce = crypto.randomBytes(32).toString('base64');
    let short = getShortened(url, HASH);

    while (await lookUp(short)) {
        url += nonce;
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
    // TODO: implement
}

module.exports = { lookUp, createEntry };