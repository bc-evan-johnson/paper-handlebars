'use strict';
const url = require('url');

function isValidURL(val) {
    try {
        return url.parse(val).hostname !== null;
    } catch (e) {
        return false;
    }
}

/*
 * Based on https://github.com/jonschlinkert/get-value/blob/2.0.6/index.js, but
 * with configurability that was not used in handlebars-helpers removed.
 */
function getValue(object, path) {
    let parts;
    // accept array or string for backwards compatibility
    if (Array.isArray(path)) {
        path = path.join('.');
    } else if (typeof path !== 'string') {
        let key = String(path);
        return Object.prototype.hasOwnProperty.call(object, key) ? object[key] : undefined;
    }

    parts = path.split(/[[.\]]/).filter(Boolean);

    let result = object;
    let prefix = '';
    for (let key of parts) {
        // preserve handling of trailing backslashes for backwards compatibility
        if (key.slice(-1) === '\\') {
            prefix = prefix + key.slice(0, -1) + '.';
            continue;
        }
        key = prefix + key;
        if (Object.prototype.hasOwnProperty.call(result, key)) {
            result = result[key];
            prefix = '';
        } else {
            return;
        }
    }
    return result;
}

function unwrapIfSafeString(handlebars, val) {
    if (val instanceof handlebars.SafeString) {
        val = val.toString();
    }
    return val;
}

const maximumPixelSize = 5120;

module.exports = {
    isValidURL,
    getValue,
    unwrapIfSafeString,
    maximumPixelSize
};
