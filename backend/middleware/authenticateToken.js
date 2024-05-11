const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) {
        return res.status(401).json({ message: 'Missing token' });
    }

    //verify jwt
    jwt.verify(token, 'secret-key', (error, user) => {
        if (error) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        // console.log('Decoded user: ', user);
        req.user = user;
        next();
    })
}

module.exports = authenticateToken;