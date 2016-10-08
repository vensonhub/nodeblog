var express = require('express');
var models = require('../models');
var util = require('../util');
var auth = require('../middleware/auth');
var router = express.Router();

/* GET users listing. */
//router.get('/', function(req, res, next) {
//  res.send('respond with a resource');
//});
//注册
router.get('/reg',auth.checkNotLogin, function(req, res, next) {
  res.render('user/reg',{title:'注册'});
});

router.post('/reg',auth.checkNotLogin,function(req,res,next){

  req.body.password = util.md5(req.body.password);
  req.body.avatar = 'http://img.zcool.cn/community/01d3f45549fc4a0000009e32c58d31.jpg';
  models.User.create(req.body,function(err,doc){
      console.log(doc);
      if(err){
          req.flash('error','用户注册失败');
      }else{
        req.flash('success','用户注册成功');
        res.redirect('/users/login');
      }
  });
});

//登陆
router.get('/login',auth.checkNotLogin, function(req, res, next) {
  res.render('user/login',{title:'登陆'});
});

router.post('/login',auth.checkNotLogin,function(req,res,next){
    req.body.password = util.md5(req.body.password);
    console.log(req.body);
   models.User.findOne({username:req.body.username,password:req.body.password},function(err,doc){
       if(err){
           req.flash('error','用户登陆失败');
           res.redirect('back');
       }else{
           if(doc){//登陆成功
               //如果登陆成功后,把查询到的user用户赋值到session的user属性
               req.session.user = doc;
               req.flash('success','用户登陆成功');
               res.redirect('/');
           }else{//找不到登陆失败
               req.flash('error','用户登陆失败');
               res.redirect('back');
           }
       }
   });
});

//推出
router.get('/logout',auth.checkLogin, function(req, res, next) {
    req.session.user = null;
    req.flash('success','用户退出成功');
    res.redirect('/');
});

module.exports = router;
