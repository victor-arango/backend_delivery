// middleware/authenticate.js

const jwt = require('jsonwebtoken');
const keys = require('../config/keys'); 

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];

    const token = authHeader;

    console.log(token);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token no proporcionado en la solicitud',
    });
  }

  const user = verifyToken(token);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o sesión expirada',
    });
  }

  req.user = user;
  next(); 
}

function verifyToken(authorizationHeader) {
  if (typeof authorizationHeader !== 'undefined') {
    const bearerToken = authorizationHeader.split(' ')[1];
    console.log(`BEARER TOKENT  ${bearerToken}`);
    try {
      const decoded = jwt.verify(bearerToken, keys.secretOrKey); // Ajusta la clave según tu configuración
      console.log(`DECODED ${decoded}` );
      return decoded;
    } catch (err) {
      return null;
    }
  } else {
    return null;
  }
}

module.exports = authenticateToken;
