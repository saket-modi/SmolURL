require('dotenv').config();
const urlModel = require('./models/url.js');
const crypto = require('node:crypto');

const { verifyUrl, cleanUrl } = require('./util.js');

// constants
const LOOKUP_LONGURL = false;

// exported
async function lookUp(res, lookUpShort=true) {
    var urlEntry = null;
    if (lookUpShort) {
        // lookup short url
        urlEntry = await urlModel.findOne({ "short": res });
    } else {
        // lookup long url
        res = cleanUrl(res);
        console.log(res);
        urlEntry = await urlModel.findOne({ "url": res });
    }
    if (!urlEntry) {
        return false;
    }
    return urlEntry;
}

// internal
async function createEntry(url) {
    url = cleanUrl(url);
    console.log(url);
    var urlEntry
    if (urlEntry = await lookUp(url, LOOKUP_LONGURL)) {
        // already been shortened
        //console.log(`returning stored entry`);
        return [urlEntry, false];
    }

    if(!(await verifyUrl(url))) return [false, false];

    const nonce = crypto.randomBytes(32).toString('base64');
    let short = getShortened(url);

    while (await lookUp(short)) {
        url += nonce;
        short = getShortened(url);
    }

    urlEntry = new urlModel({ "url": url, "short": short});
    await urlEntry.save();
    return [urlEntry, true];
}

// url shortening logic
function getShortened(url) {
    return getHash(url);
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