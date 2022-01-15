
const config = require('../config/default.json');
const axios = require('axios')
const qs = require('qs')

async function token(req, res, next) {
    try {
        var client_id = config.client_id;
    var client_secret = config.client_secret;
    
    var authOptions = {
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    
    };
    
    const spotifyRes = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({ grant_type: 'client_credentials' }), authOptions)
    req.token = spotifyRes.data.access_token;
    next();
    } catch (err) {
        return res.status(405).send("Error grabbing spotify token.");
    }
    
}

module.exports = token;
