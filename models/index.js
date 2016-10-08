var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.dbUrl);


exports.User = mongoose.model('user',new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    avatar:String
}))

exports.Article = mongoose.model('article',new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    title:String,
    content:String,
    pv:{type:Number,default:0},
    poster:String,
    comments: [{user:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
        content:String,createAt:{type: Date, default: Date.now}}],
    createAt:{type:Date,default:Date.now()}
}))