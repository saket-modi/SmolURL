function cleanUrl(url) {

    var protoIdx = url.indexOf(':');
    url = url.substring(protoIdx + 2);

    var queryIdx = url.indexOf('?');
    if (queryIdx != -1) {
        url = url.substring(0, queryIdx);
    }
    return url;
}

async function verifyUrl(url) { // check if url string is clean, else return false

    // remove query string if present
    url = cleanUrl(url);

    if (/\s/.test(url)) {
        // any whitespace given by \s meta
        return false;
    }

    // check if the url leads to a valid status code
    return fetch(url, {method: `HEAD`})
    .then(response => response.ok)
    .catch(() => false)
}

function sanitizeUrl(url) {
    // add http to url if not present
    if (!/^http?:\/\//i.test(url)) {
        url = `http://${url}`;
    }
    return url;
}

module.exports = { verifyUrl, sanitizeUrl, cleanUrl };