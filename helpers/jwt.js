var { expressjwt:jwt} = require('express-jwt');
const {User} = require("../models/user");
function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return jwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            {url: /\/public\/uploads(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/products(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/categories(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/orders(.*)/,methods: ['GET', 'OPTIONS', 'POST']},
            '/api/v1/users/login',

            '/api/v1/users/register',
             '/api/v1/users/aggregation',
            
        
          ]
        })
}

async function isRevoked(req, payload) {
    console.log(payload);
    if(payload.isAdmin == false){
        console.log('Not Admin');
        return true;
    }
    console.log('Admin')
    return false;
  }



module.exports = authJwt;