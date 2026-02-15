const express = require("express")
const userModel = require('../models/user')
const urlModel = require('../models/url')
const bcrypt = require('bcrypt')
const saltRounds = 10
const { nanoid } = require('nanoid')
let jwt = require('jsonwebtoken');

async function HandleUserSignUpData(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).render('signuppage', {
                error: "Fill the details"
            })
        }
        const bcryptPassword = await bcrypt.hash(password, saltRounds)

        await userModel.create({
            email: email,
            password: bcryptPassword
        })
        return res.status(201).render('signuppage')
    }
    catch (err) {
        return res.status(500).render('signuppage', {
            error: "There is issue in signup pls try again"
        });
    }
}

async function HandleUserLoginData(req, res) {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).render('signuppage', {
                error: "Fill the details"
            })
        }
        const userExist = await userModel.findOne({ email })
        if (!userExist) {
            return res.status(404).render('loginpage', { error: "User not found" })
        }
        const passwordMatch = await bcrypt.compare(password, userExist.password)
        if (!passwordMatch) {
            return res.status(401).render('loginpage', { error: "User not found" })
        }
        const token = jwt.sign({
            userId: userExist._id
        },
            process.env.JWT_SECRET,
        );
        res.cookie("token", token, {
            httpOnly: true,
        })
        return res.redirect('/shortUrlHomePage')
    }
    catch (err) {
        res.status(500).render('loginpage', { error: "User not found" })
    }
}

async function HandleUrl(req, res) {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).send("No url found")
        }
        shortId = nanoid()
        await urlModel.create({
            shorturl: shortId,
            redirect: url,
            createdBy: req.user.userId
        })
        return res.redirect('/shortUrlHomePage')
    }
    catch (err) {
        return res.status(500).send(err)
    }
}

function logOutRoute(req, res) {
    res.clearCookie('token');
    return res.redirect('/login')
}

async function DeleteTheUrl(req, res) {
    try {
        const urlId = req.params.id;
        const userId = req.user.userId
        console.log(urlId)
        console.log(userId)
        if (!urlId || !userId) {
            return res.redirect('/shortUrlHomePage')
        }
        // const deleteUrl = await urlModel.findByIdAndDelete(urlId);
        const deleteUrl = await urlModel.deleteOne({
            createdBy: userId,
            _id: urlId
        })
        // implimated the attribute based access control athorization

        const isDeleted=deleteUrl.deletedCount===1
        if (!isDeleted) {
            return res.redirect('/shortUrlHomePage')
        }
        return res.redirect('/shortUrlHomePage')
    }
    catch (err) {
         return res.redirect('/shortUrlHomePage')
    }   
}


module.exports = {
    HandleUserSignUpData,
    HandleUserLoginData,
    HandleUrl,
    logOutRoute,
    DeleteTheUrl
}