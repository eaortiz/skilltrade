(function() {
	for heroku
	var mongoUri = process.env.MONGOLAB_URI ||
	  process.env.MONGOHQ_URL ||
	  'mongodb://localhost/mydb';

	mongo.Db.connect(mongoUri, function (err, db) {
	  db.collection('user', function(er, collection) {
	    collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {
	    });
	  });
	});
	var mongoose = require('mongoose');
	//mongoose.connect('mongodb://localhost/test');
	mongoose.connect(mongoUri)
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback () {
	  console.log('database connected')
	});

	var Schema = mongoose.Schema
	var ObjectId = Schema.Types.ObjectId
	var Model = {}

	var UserSchema = Schema({
	    id          : ObjectId,
	    name        : { type: String, required: true },
	    description : { type: String, default: ''},
	    photo				: { type: String, default: ''},
	    contact			: { type: String, default: ''},
	    flyers  : [ {type : mongoose.Schema.ObjectId, ref : 'Flyer'} ],
	    matches : [ {type : mongoose.Schema.ObjectId, ref : 'Match'} ]
	});

	var FlyerSchema = Schema({
	    id      	: ObjectId,
	    want    	: { type: String, default: '' },
	    user      : { type: mongoose.Schema.ObjectId, ref: 'User'},
	    acceptedBy    : [ {type : mongoose.Schema.ObjectId, ref : 'User'} ]
	});

	var MatchSchema = Schema({
		id 			: ObjectId,
		flyer1: {type: mongoose.Schema.ObjectId, ref: 'Flyer'},
		flyer2: {type: mongoose.Schema.ObjectId, ref: 'Flyer'}
	})


	Model.User = mongoose.model('User', UserSchema)
	Model.Flyer = mongoose.model('Flyer', FlyerSchema)
	Model.Match = mongoose.model('Match', MatchSchema)

	module.exports = Model
})()