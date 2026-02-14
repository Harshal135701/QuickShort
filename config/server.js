const mongoose = require('mongoose')

async function ConnectDb(req, res) {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/SelfPracticeOfMvc')
        console.log("The db is connected")
    }
    catch(err){
        console.error(err);
    }
}
module.exports=ConnectDb