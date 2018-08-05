var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose');


//connect mongoose db
mongoose.connect('mongodb://localhost/haivn');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Lỗi kết nối csdl:'));
db.once('open', function() {
  console.log('Kết nối dbs thành công!')
});

var User = require('./models/User');
var Photo = require('./models/Photo');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var photosRouter = require('./routes/photos');
var likesRouter = require('./routes/likes');

var app = express();

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
app.use('/photos', photosRouter);
app.use('/likes', likesRouter);

app.get('/test/add-user', function(req, res){
	var u = new User({
		username: "admin",
		email: "email@gmail.com",
		password: "123456",
		fullName: "Quản Trị Viên",
		avatar: "https://genknews.genkcdn.vn/2017/1-1495855852180.jpg",
		cover: "http://dantricdn.com/kvQpnUqsv918uIS3qnCP/Image/2013/12/01/ln14124-a9a1a.jpg"
	});

		u.save(function(err){
			if(err){
				res.send("err");
			}
			else{
				res.send("ok");
			}
		});
});

app.get('/test/get-time', function(req, res) {


	res.send(datetime);
});

app.get('/test/add-photo', function(req, res) {
	var today = new Date();
                        var dd = today.getDate();
                        var mm = today.getMonth()+1; //January is 0!
                        var yyyy = today.getFullYear();
                        var hour = today.getHours();
                        var min = today.getMinutes();

                        if(dd<10) {
                            dd='0'+dd
                        } 

                        if(mm<10) {
                            mm='0'+mm
                        } 
                        today = dd+'/'+mm+'/'+yyyy;

	var p = new Photo({
		created: today,
		title: "Quan trong la than thai",
		description: "Quan trong nhat van la than thai nhe!",
		url: "http://nguoi-noi-tieng.com/photo/tieu-su-kha-ngan-9327.jpg",
		owner: {
			name: "admin",
			username: "admin",
			avatar: "https://genknews.genkcdn.vn/2017/1-1495855852180.jpg"
		}
	});

		p.save(function(err){
			if(err) {
				res.send(err);
			}
			else {

				res.send("ok");
			}
		});

});

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
