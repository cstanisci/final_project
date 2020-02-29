const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken')
const config = require('config');
// Express validator makes it easy to validate user registrations fields.
const {
    check,
    validationResult
} = require('express-validator');

const User = require('../../models/User');

// @route   GET api/auth
// @desc    Get user by token
// @access  Private
// Adding auth as second parameter makes the route protected.

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth
// @desc    Login - Authenticate user & get token
// @access  Public
router.post('/', [
        check('email', 'Valid email is required.').isEmail(),
        check('password', 'Password required.').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const {
            email,
            password
        } = req.body;

        try {
            // See if user exists - if they do, return error.
            let user = await User.findOne({
                email
            });
            if (!user) {
                return res.status(400).json({
                    errors: [{
                        msg: 'Invalid login information.'
                    }]
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    errors: [{
                        msg: 'Invalid login information.'
                    }]
                });
            }
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