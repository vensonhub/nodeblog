var express = require('express');
var models = require('../models');
var markdown = require('markdown').markdown;
var auth = require('../middleware/auth');
var multer  = require('multer');
//指定存储的目录和文件名
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    //cb(null, Date.now()+'.'+file.mimetype.slice(file.mimetype.indexOf('/')+1))
  }
});
var upload = multer({ storage: storage });

var router = express.Router();

//发文章
router.get('/add',auth.checkLogin, function(req, res, next) {
  res.render('article/add',{article:{}});
});

router.post('/add',auth.checkLogin,upload.single('poster'), function(req, res, next) {
  console.log(req.file);
  var article = req.body;
  var _id = article._id;
  if(_id){
    var updateObj = {title:article.title,content:article.content};
    if(req.file){
      updateObj.poster = '/uploads/'+req.file.filename;
    }

    models.Article.update({_id:_id},{$set:updateObj},function(err,result){
      if(err){
        req.flash('error','文章更新失败')
      }else{
        req.flash('success','文章更新成功')
        res.redirect('/');
      }
    });
  }else{
    if(req.file){
      article.poster = '/uploads/'+req.file.filename;
    }
    article.user = req.session.user._id;
    models.Article.create(article,function(err,doc){
      if(err){
        req.flash('error','文章发布失败')
      }else{
        req.flash('success','文章发表成功')
        res.redirect('/');
      }
    });
  }

});

router.get('/detail/:_id',function(req,res,next){
  var _id = req.params._id;
  models.Article.findById(_id,function(err,article){
    article.content = markdown.toHTML(article.content);
    res.render('article/detail',{article:article});
  });
});

router.get('/delete/:_id',function(req,res,next){
  var _id = req.params._id;
  models.Article.remove({_id:_id},function(err,result){
    res.redirect('/');
  });
});

router.get('/edit/:_id',function(req,res,next){
  var _id = req.params._id;
  models.Article.findById(_id,function(err,article){
    res.render('article/add',{article:article});
  });
});

module.exports = router;
