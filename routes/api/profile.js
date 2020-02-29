const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const {
    check,
    validationResult
} = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');


// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({
                msg: 'There is no profile.'
            });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private

router.post('/', [auth, [
    check('status', 'Status is required.').not().isEmpty(),
    check('skills', 'Skills are required.').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    //  Pull everything out of req.body - build out profile.  If exists, update. If not, create.
    const {
        company,
        location,
        website,
        bio,
        skills,
        status,
        githubusername,
        facebook,
        instagram,
        linkedin
    } = req.body;

    // Build Profile Object - check to make sure there are responses before setting it.
    const profileObject = {};
    profileObject.user = req.user.id;
    if (company) profileObject.company = company;
    if (website) profileObject.website = website;
    if (location) profileObject.location = location;
    if (bio) profileObject.bio = bio;
    if (status) profileObject.status = status;
    if (githubusername) profileObject.githubusername = githubusername;
    if (skills) {
        profileObject.skills = skills.split(',').map(skill => skill.trim());
    }

    // Build social media object - need to initialize social object separately first or profileObject.social would show as undefined.
    profileObject.social = {};
    if (facebook) profileObject.social.facebook = facebook;
    if (linkedin) profileObject.social.linkedin = linkedin;
    if (instagram) profileObject.social.instagram = instagram;



    try {
        // If there is a profile, update it
        let profile = await Profile.findOneAndUpdate({
            user: req.user.id
        }, {
            $set: profileObject
        }, {
            new: true,
            upset: true
        });

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/profile
// @desc    Show all profiles
// @access  Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).status('Server Error.')
    }
});

// @route   GET api/profile/user/:user_id
// @desc    Show profile by user ID
// @access  Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar']);

        if (!profile) return res.status(400).json({
            msg: 'Profile not found.'
        });
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({
                msg: 'Profile not found.'
            });
        }
        res.status(500).status('Server Error.');
    }
});

// @route   DELETE api/profile
// @desc    Delete profile, user, and posts
// @access  Private

router.delete('/', auth, async (req, res) => {
    try {

        // Remove profile
        await Profile.findOneAndRemove({
            user: req.user.id
        });
        // Remove user
        await User.findOneAndRemove({
            _id: req.user.id
        });
        res.json({
            msg: 'User has been removed.'
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).status('Server Error.');
    }
});

// @route   GET api/profile/github/:username
// @desc    Get user repos from github
// @access  Public

router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: {
                'user-agent': 'node.js'
            }
        };

        request(options, (error, response, body) => {
            if (error) console.error(error);
            if (response.statusCode !== 200) {
                return res.status(404).json({
                    msg: 'No Github profile found.'
                })
            };
            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({
            msg: 'Server Error'
        });
    }
});

module.exports = router;