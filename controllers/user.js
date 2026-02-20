const userModel = require('../models/user')
const urlModel = require('../models/url')
const bcrypt = require('bcrypt')
const { nanoid } = require('nanoid')
let jwt = require('jsonwebtoken');

const saltRounds = 10

async function HandleUserSignUpData(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render('signuppage', {
                error: "Fill the details"
            })
        }

        const bcryptPassword = await bcrypt.hash(password, saltRounds)

        let profileFileName = null
        if (req.file) {
            profileFileName = req.file.filename
        }

        await userModel.create({
            email,
            password: bcryptPassword,
            profilepic: profileFileName
        })

        return res.status(201).render('signuppage')
    }
    catch (err) {
        return res.status(500).render('signuppage', {
            error: "Signup failed, try again"
        });
    }
}


async function HandleUserLoginData(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).render('loginpage', {
                error: "Fill the details"
            })
        }

        const userExist = await userModel.findOne({ email })

        if (!userExist) {
            return res.status(404).render('loginpage', { error: "User not found" })
        }

        const passwordMatch = await bcrypt.compare(password, userExist.password)

        if (!passwordMatch) {
            return res.status(401).render('loginpage', { error: "Wrong password" })
        }

        const token = jwt.sign(
            { userId: userExist._id },
            process.env.JWT_SECRET
        );

        res.cookie("token", token, { httpOnly: true })

        const urls = await urlModel.find({ createdBy: userExist._id })

        return res.render('shortUrlHomePage', {
            user: userExist,
            urls
        })
    }
    catch (err) {
        return res.status(500).render('loginpage', { error: "Login failed" })
    }
}

async function HandleUrl(req, res) {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).send("No url found")
        }

        const shortId = nanoid()

        await urlModel.create({
            shorturl: shortId,
            redirect: url,
            createdBy: req.user.userId,
            visitHistory: []
        })

        return res.redirect('/shortUrlHomePage')
    }
    catch (err) {
        return res.status(500).send("Server error")
    }
}

async function DeleteTheUrl(req, res) {
    try {
        const urlId = req.params.id;
        const userId = req.user.userId

        if (!urlId || !userId) {
            return res.redirect('/shortUrlHomePage')
        }

        await urlModel.deleteOne({
            createdBy: userId,
            _id: urlId
        })

        return res.redirect('/shortUrlHomePage')
    }
    catch (err) {
        return res.redirect('/shortUrlHomePage')
    }
}

function logOutRoute(req, res) {
    try {
        // clear the token cookie
        res.clearCookie("token");

        // redirect user to login page after logout
        return res.redirect("/login");
    } catch (err) {
        return res.status(500).send("Logout failed");
    }
}

module.exports={
    DeleteTheUrl,
    HandleUrl,
    HandleUserLoginData,
    HandleUserSignUpData,
    logOutRoute
}