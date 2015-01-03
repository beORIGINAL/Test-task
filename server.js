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

	if(env === 'development'){
		mongoose.connect('mongodb://localhost/testTask');
	}else{
		mongoose.connect('mongodb://edgar:berdichev92@ds029811.mongolab.com:29811/creativechatroom');
	}

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error...'));
	db.once('open', function callback(){
		console.log('testTask db opened');
	});
	var messageSchema = mongoose.Schema({message: String});
	var Message = mongoose.model('Message', messageSchema);
	var mongoMessage;
	Message.findOne().exec(function(err, messageDoc) {
		mongoMessage = messageDoc.message;
	});
	app.get('/partials/:partialPath', function(req, res){
		res.render('partials/' + req.params.partialPath);
	});

	app.get('*', function(req, res) {
		res.render('index', {
			mongoMessage: mongoMessage
		});
	});

var port = process.env.PORT || 3030;
app.listen(port);
console.log('Listening on port ' + port + '...');