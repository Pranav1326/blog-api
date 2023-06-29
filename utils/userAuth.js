const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();

module.exports = async (req, res) => {
    try {
        const token = await req.headers.authorization.split(" ")[1];
        const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
        const user = await decodedToken;
        req.user = user;
        return user;
    } catch (error) {
        return error;
    }
}