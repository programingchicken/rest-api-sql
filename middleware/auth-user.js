const auth = require('basic-auth');
const  User  = require('../models').User;
const bcrypt = require('bcrypt');

// Middleware to authenticate the request using Basic Auth.
exports.authenticateUser = async (req, res, next) => {
    let warningText;
console.log(1)
    const credentials = auth(req)

    if (credentials) {
        const user = await User.findOne({ where: { emailAddress: credentials.name } })
        console.log(2)
        if (user) {
            //dont completly understand got this code from example on treehouse
            const authenticated = bcrypt
                .compareSync(credentials.pass, user.password);
                console.log(3)
            if (authenticated) {
                console.log(`Authentication successful for emailAddress: ${user.emailAddress}`);
                // Store the user on the Request object.
                req.currentUser = user;
                console.log(req.currentUser)
                console.log(4)
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
