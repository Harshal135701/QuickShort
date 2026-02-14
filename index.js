const express = require("express")
const app = express()
const path=require('path')
const port = 3000
const cookieParser=require('cookie-parser')
app.use(cookieParser())

// Requiring the routes

const userRoute=require("./routes/user")
const ConnectDb=require("./config/server")
ConnectDb()
const staticRoute=require('./routes/staticRoute')
require("dotenv").config()

// Setting the paths
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

// Middleware to parse standard form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes 
app.use("/",userRoute);
app.use("/",staticRoute);

app.listen(port, () => {
    console.log(`The app is listening on port ${port}`)
})