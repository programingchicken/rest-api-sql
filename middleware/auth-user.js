const auth = require('basic-auth');
const  User  = require('../models').User;
const bcrypt = require('bcrypt');


// Middleware to authenticate the request using Basic Auth.
exports.authenticateUser = async(req, res, next) => {
    //empty var to hold error text
    let errorText

    //gets the auth user
    const isAuth = auth(req)

    if(isAuth) {

        //gets user from database
        const user = await User.findOne({where: {emailAddress: isAuth.name}})

        if (user) {
            //checks if the user password matched the auth password
            const theTrueAuth = bcrypt
                .compareSync(isAuth.pass, user.password)
            if (theTrueAuth) {
                req.currentUser = user;
                res.send(`Authentication successful for emailAddress: ${user.emailAddress}`)
            } else {
                errorText = `Authentication failure for emailAddress: ${user.emailAddress}`;
            }

        } else {
            errorText = `User not found for emailAddress: ${credentials.emailAddress}`;
        }
    } else {
        errorText = 'Auth header not found';
    }

    if (errorText) {
        console.warn(errorText);
        res.status(401).json({ errorText: 'Access Denied' });
      } else {
        next();
      }
}