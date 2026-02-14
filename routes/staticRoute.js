const express = require('express')
const URL = require('../models/url')
const router = express.Router()
const { authMiddleware } = require('../middlewares/auth')
const { logOutRoute } = require('../controllers/user')

router.get('/login', (req, res) => {
    res.render('loginpage')
})

router.get('/', (req, res) => {
    res.render('signuppage')
})

router.get('/shortUrlHomePage', authMiddleware, async (req, res) => {
    const urls = await URL.find({ createdBy: req.user.userId });
    return res.render('shortUrlHomePage', { urls });
})

router.get('/signuppage', (req, res) => {
    try {
        return res.render('signuppage');
    }
    catch (err) {
        return res.status(500).render('signuppage', {
            error: "Something wrong"
        })
    }
})


router.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
        { shorturl: shortId },
        {
            $push: {
                visited: {
                    timestamp: Date.now(),
                },
            },
        },
        { new: true }
    );

    if (!entry) {
        return res.status(404).send("URL not found");
    }

    res.redirect(entry.redirect);
});

router.post('/logout', authMiddleware, logOutRoute)





module.exports = router