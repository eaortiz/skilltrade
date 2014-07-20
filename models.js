(function() {
	// for heroku
	// var mongoUri = process.env.MONGOLAB_URI ||
	//   process.env.MONGOHQ_URL ||
	//   'mongodb://localhost/mydb';

	// mongo.Db.connect(mongoUri, function (err, db) {
	//   db.collection('user', function(er, collection) {
	//     collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {
	//     });
	//   });
	// });
	var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost/test');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback () {
	  console.log('database connected')
	});

	var Schema = mongoose.Schema
	var ObjectId = Schema.Types.ObjectId
	var Model = {}

	var UserSchema = new Schema({
	    id          : ObjectId,
	    name        : { type: String, required: true },
	    description : { type: String, default: ''},
	    photo				: { type: String, default: ''},
	    contact			: { type: String, default: ''},
	    flyers  : [ {type : mongoose.Schema.ObjectId, ref : 'Flyer'} ]
	});

	var FlyerSchema = new Schema({
	    id      : ObjectId,
	    want        : { want: String, default: '' },
	    user       : { type: mongoose.Schema.ObjectId, ref: 'User'},
	    acceptedBy    : [ {type : mongoose.Schema.ObjectId, ref : 'User'} ]
	});

	var MatchSchema = new Schema({
		id 			: ObjectId,
		learner1: {type: mongoose.Schema.ObjectId, ref: 'User'},
		learner2: {type: mongoose.Schema.ObjectId, ref: 'User'}
	})


	Model.User = mongoose.model('User', UserSchema)
	Model.Flyer = mongoose.model('Flyer', FlyerSchema)
	Model.Match = mongoose.model('Match', MatchSchema)

	module.exports = Model
})()