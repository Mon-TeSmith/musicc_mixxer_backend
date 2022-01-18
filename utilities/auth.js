const crypto = require('crypto');

const hassPassword = (plainText) => {
    return crypto.createHmac('sha256', 'secret key')
        .update(plainText)
        .digest('hex');
}

module.exports = { hashPassword };