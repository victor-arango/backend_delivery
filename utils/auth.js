const jwt = require('jsonwebtoken');
const { secretOrKey } = require('../config/keys');

function verifyToken(authorizationHeader) {
    if (typeof authorizationHeader !== 'undefined') {
        const bearerToken = authorizationHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(bearerToken, secretOrKey);
            return decoded;
        } catch (err) {
            return null;
        }
    } else {
        return null;
    }
}

function getJwtToken(payload) {
    return jwt.sign(payload, secretOrKey, { expiresIn: '1h' }); // Ajusta la expiración según tus necesidades
}

module.exports = {
    verifyToken,
    getJwtToken,
};
