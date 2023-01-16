const express=require('express');
const logger=require('morgan');
const path=require('path');
const mongoose = require('./config/connection');
const ejs=require('ejs');
const cookieParser=require('cookie-parser');
const session = require('express-session');
const multer = require('multer');





//Routes
const userRouter=require('./routes/user');
const adminRouter=require('./routes/admin');

const app=express();


//view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));


//session
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: 'secret-key',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: oneDay},
}
))

app.use(function (req, res, next) {
    res.header('Cache-control', "private,no-cache,no-store,must-revalidate")
    next()
})

app.use('/admin',adminRouter)
  app.use('/',userRouter)

  app.use(function(req, res, next) {
    res.status(404);
  
    // respond with html page
    if (req.accepts('html')) {
      res.render('user/404Page');
      return;
    }
  
    // respond with json
    if (req.accepts('json')) {
      res.json({ error: 'Not found' });
      return;
    }
  
    // default to plain-text. send()
    res.type('txt').send('Not found');
  });

app.listen(4000,()=>{
    console.log('Server connected on port 4000');
})