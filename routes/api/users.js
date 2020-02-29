const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const config = require('config');
// Express validator makes it easy to validate user registrations fields.
const {
    check,
    validationResult
} = require('express-validator');

// Bring in User Model
const User = require('../../models/User');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/', [
        check('name', 'Name is required.').not().isEmpty(),
        check('email', 'Valid email is required.').isEmail(),
        check('password', 'Password must be 6 or more characters.').isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            name,
            email,
            password
        } = req.body;

        try {
            // See if user exists - if they do, return error.
            let user = await User.findOne({
                email
            });
            if (user) {
                return res.status(400).json({
                    errors: [{
                        msg: 'Email has already been registered.'
                    }]
                });
            }
            // Get users gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })
            // Create User
            user = new User({
                name,
                email,
                avatar,
                password
            });
            // Encrypt/has password
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);
            // Save user in the DB
            await user.save();

            // Return jwt - on the front end, when a user registers we want them to get logged in right away.  In order to be logged in, we need that token
            // Get payload which includes userId
            const payload = {
                user: {
                    id: user.id
                }
            };

            // Sign token - pass in the payload, the secret, and the expiration.
            // Inside callback, if we don't get an error we send that token back to the client.
            jwt.sign(payload, config.get('jwtSecret'), {
                    expiresIn: 3600000
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token
                    });
                });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });

module.exports = router;