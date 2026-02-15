const express = require('express')
const { authMiddleware } = require('../middlewares/auth')
const router = express.Router()
const { HandleUserSignUpData, HandleUserLoginData, HandleUrl } = require('../controllers/user')
const {DeleteTheUrl}=require('../controllers/user')

router.post('/user', HandleUserSignUpData)
router.post('/login', HandleUserLoginData)
router.post('/shortUrlHomePage', authMiddleware, HandleUrl)
router.post('/url/delete/:id',authMiddleware,DeleteTheUrl)

module.exports = router