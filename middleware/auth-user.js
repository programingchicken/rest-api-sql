const auth = require('basic-auth');
const  User  = require('../models').User;
const bcrypt = require('bcrypt');

// Middleware to authenticate the request using Basic Auth.
exports.authenticateUser = async (req, res, next) => {

    //this is a empty text var with a warning 
    let warningText;

    //this is the auth user
    const credentials = auth(req)

    //test if it is true
    if (credentials) {
        //finds the user in the database
        const user = await User.findOne({ where: { emailAddress: credentials.name } })

        //if it finds user in database
        if (user) {

            //check if auth user pass matches database user password
            const authenticated = bcrypt
                .compareSync(credentials.pass, user.password);
            //if compareSync true
            if (authenticated) {
                console.log(`Authentication successful for emailAddress: ${user.emailAddress}`);
                // Store the user on the Request object.
                req.currentUser = user;
                console.log(req.currentUser)
            } else {
                warningText = `Authentication failure for emailAddress: ${user.emailAddress}`;
            }  
        } else {
            warningText = `User not found for emailAddress: ${credentials.emailAddress}`;
        }
    } else {
        warningText = 'Auth header not found';
    }

    if (warningText) {
        console.warn(warningText);
        res.status(401).json({ warningText: 'Access Denied' });
      } else {
        next();
      }
}
