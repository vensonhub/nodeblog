//Express框架
var express = require('express');
//处理路径 path.join() path.resolve()
var path = require('path');
//处理收藏夹图标
var favicon = require('serve-favicon');
//写日志的
var logger = require('morgan');
//处理cookie解析,req.cookies
//res.cookie(key,value); 向客户端写入cookie
var cookieParser = require('cookie-parser');
//处理请求体 req.body 属性 ,存放请求体 对象类型
var bodyParser = require('body-parser');
//主页路由
var routes = require('./routes/index');
//用户路由
var users = require('./routes/users');
//文章路由
var articles = require('./routes/articles');
//引入session中间件,req.session;session依赖cookie,所以要放到cookieParser后
var session = require('express-session');
//得到mongo
var MongoStore = require('connect-mongo')(session);
//引入mongodb 连接
var config = require('./config');
//传值,依赖session
var flash = require('connect-flash');

//express的实例
var app = express();

// view engine setup
//设置到app.settings里面
//设置模版存放路径,当前项目下的views目录
app.set('views', path.join(__dirname, 'views'));
//设置模版引擎
app.set('view engine', 'html');
//自定义增加 第一个参数是扩展名 html ,第二个参数是用哪个引擎渲染的;__express就等于renderFile渲染函数
app.engine('html',require('ejs').__express);

// uncomment after placing your favicon in /public
//在把favicon放入 /public后取消注释
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//日志记录中间件,dev是一种格式
//:method :url :status :res[content-length] - :response-time ms
app.use(logger('dev'));
//为什么是两个,因为类型可能多种多样
//处理Content-Type:application/json的请求体{"name":"lws"}
app.use(bodyParser.json());
//处理Content-Type:urlencoded的请求体,extened为true表示使用querystring来将请求体的字符串转成对象 name=lws&age=18;
app.use(bodyParser.urlencoded({ extended: false }));

//cookie处理中间件,req.cookies res.cookie(key,value)
app.use(cookieParser());
//session中间件
app.use(session({
  secret:'lws',//加密字符串
  resave:true,//每次响应后重新保存数据
  saveUninitialized:true,//保存新穿件但未初始化的session
  store:new MongoStore({
    url:config.dbUrl
  })//将session存放到数据库里面
}));
app.use(flash());
//公用的session
app.use(function(req,res,next){
  //res.locals 才是真正的渲染数据的对象
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  res.locals.keyword = req.session.keyword;
  next();
})



//静态文件服务中间件,指定一个绝对目录的路径作为静态文件的根目录
app.use(express.static(path.join(__dirname, 'public')));
//指定路由
app.use('/', routes);
//指定用户模块路由
app.use('/users', users);
//指定用户模块路由
app.use('/articles', articles);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//错误处理
// error handlers

//开发时候的错误处理
// development error handler
//将打印出错误的堆栈信息
// will print stacktrace
if (app.get('env') === 'development') {
  //错误处理中间件有4哥参数:第一个参数是错误对象,将错误对象作为参数传入next(error)并跳过后面的所有中间件.
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

//产品上的错误处理,产品上不能够让用户看到如服务器路径什么的,所以错误对象置空,开发和产品区别就在于错误对象.
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
