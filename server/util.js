function verifyUrl(url) { // check if url string is clean, else return false

    if (/\s/.test(url)) {
        // any whitespace given by \s meta
        return false;
    }

    // check if the url leads to a valid status code
    var valid = true;
    fetch(url).then(
        (response) => {
            if (!response.ok) {
                valid = false;
            }
        }
    ).catch(err => {
        console.log(`error: ${err}`);
    })
    if (!valid) return false;

    return true;
}

function sanitizeUrl(url) {
    // add http to url if not present
    if (!/^http?:\/\//i.test(url)) {
        url = `http://${url}`;
    }
    return url;
}

module.exports = { verifyUrl, sanitizeUrl };