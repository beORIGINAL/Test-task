var express = require('express'),
	morgan  = require('morgan'),
	bodyParser = require('body-parser'),
	stylus = require('stylus'),
	mongoose = require('mongoose'),
	env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
	app = express();

	function compile(str, path){
		return stylus(str).set('filename', path);
	}

	app.set('views', __dirname + '/server/views');
	app.set('view engine', 'jade');
	app.use(morgan('dev'));
	app.use(bodyParser());
	app.use(stylus.middleware({
		src: __dirname + '/public',
		compile: compile
	}));
	app.use(express.static(__dirname + '/public'));

	mongoose.connect('mongodb://localhost/MEAN/testTask');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error...'));
	db.once('open', function callback(){
		console.log('testTask db opened');
	});

	app.get('/partials/:partialPath', function(req, res){
		res.render('partials/' + req.params.partialPath);
	});

	app.get('*', function(req, res) {
		res.render('index');
	});

var port = 3030;
app.listen(port);
console.log('Listening on port ' + port + '...');