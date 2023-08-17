const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require("dotenv").config();
const mongoose = require("mongoose")
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const authRouter = require('./routes/auth');
const friendshipsRouter = require('./routes/friendships');
const commentsRouter = require('./routes/comments');
const likesRouter = require('./routes/likes');
const cookieSession = require('cookie-session');
const passport = require('passport');
const passportSetup = require('./passport');
const cors = require("cors")
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({limit: "2mb", extended: true}))
app.use(bodyParser.json({limit: "2mb", extended: true}))


const db_uri = process.env.DB_URI
mongoose.connect(db_uri , {useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => {
  app.listen(3000, () => console.log("App started on port 3000"));
  console.log("Connected to DB")})
.catch((err) => {console.log(err)});

app.use(cookieSession({
  name: "session",
  keys: [process.env.SECRET_KEY],
  maxAge: 24 * 60 * 60 * 100,
  secure: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(cors({
  origin: process.env.CLIENT_URI,  
  credentials: true,
}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);
app.use('/likes', likesRouter);
app.use('/friendships', friendshipsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
