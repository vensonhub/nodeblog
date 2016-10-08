var express = require('express');
var markdown = require('markdown').markdown;
var models = require('../models');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var keyword = req.query.keyword;
  var search = req.query.search;
  var pageNum = parseInt(req.query.pageNum)||1;
  var pageSize = parseInt(req.query.pageSize)||2;


  var queryobj = {};
  if(search){
    req.session.keyword = keyword;
  }

  var reg = new RegExp(keyword,'i');
  queryobj = {$or:[{title:reg},{content:reg}]};


  //先查找然后把user转换成user对象
  models.Article.find(queryobj).skip((pageNum-1)*pageSize).limit(pageSize).populate('user').exec(function(err,articles){
    articles.forEach(function (article) {
      article.content = markdown.toHTML(article.content);
    });
    models.Article.count(queryobj,function(err,count){
      res.render('index',{
        title:'主页',
        pageNum:pageNum,
        pageSize:pageSize,
        keyword:req.session.keyword,
        totalPage:Math.ceil(count/pageSize),
        articles:articles
      });
    });


  });

});

module.exports = router;
