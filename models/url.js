const mongoose=require('mongoose')
const user = require('./user')

const urlSchema=mongoose.Schema({
    shorturl:{
        type:String,
        required:true
    },
    redirect:{
        type:String,
        required:true
    },
    visited:{
        type:[{
            timestamp:{type:Date,default:Date.now}
        }],
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    }
},{timestamps:true})

module.exports=mongoose.model('url',urlSchema)