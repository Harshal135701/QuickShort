const express = require('express')
const router = express.Router()

// middlewares
const { authMiddleware } = require('../middlewares/auth')
const uploadedMiddleware = require('../middlewares/uploadProfilePic')

// controllers (IMPORTANT: import everything in ONE object)
const userController = require('../controllers/user')

const {
    HandleUserSignUpData,
    HandleUserLoginData,
    HandleUrl,
    DeleteTheUrl
} = userController


// routes
router.post('/user', uploadedMiddleware, HandleUserSignUpData)
router.post('/login', HandleUserLoginData)
router.post('/shortUrlHomePage', authMiddleware, HandleUrl)
router.post('/url/delete/:id', authMiddleware, DeleteTheUrl)

module.exports = router