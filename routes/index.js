var express = require('express')
var router = express.Router()
var models = require('../models')
var mongoose = require('mongoose');
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

/* GET home page. */
router.get('/', function(req, res) {
  res.render('landing')
})

router.get('/user/create', function(req, res) {
	res.render('create_user')
})

router.get('/user/flyers', function(req, res) {
	res.render('manageflyers.html', {user_id: '53cb24f947ba0000009b1e69'})
})

router.get('/user/profile/:id', function(req, res) {
	var id_string = req.params.id
  models.User.findOne({'_id': id_string}, function(err, user) {
		if (err) return console.error(err)
	  var data = {"name": user.name,
	              "description": user.description,
	              "picture": user.photo,
	              "contact_info": user.contact
	              }
	  res.send(data)
	})
})

router.post('/api/user/create', function(req, res) {
  var name = req.body.name,
      description = req.body.description,
      photo = req.body.photoUrl,
      contact = req.body.contact
 
	var u = new models.User({name: name, photo: photo, description: description, contact: contact})
	u.save(function (err, u) {
	if (err) return console.error(err)
      console.log(err)
	})
  console.log("user_id = " + u["_id"])
  res.redirect('/user/profile/?id=' + u._id)
})

router.post('/api/flyer/create/:id', function(req, res) {
	var id_string = req.params.id
  models.User.findOne({'_id': id_string}, function(err, user) {
   	if (err) return console.error(err)
   	var want = (req.body.want).toString()
		var flyer = new models.Flyer({user: user, want: want})
		flyer.save(function (err, f) {
		  if (err) return console.error(err)
		})
		user.flyers.push(flyer)
		user.save(function (err, u) {
		  if (err) return console.error(err)
		})
		res.end('flyer saved and added to user')
  })
})

//needs to be tested
router.post('/api/match/create', function(req, res) {
	var flyer1 = models.Flyer.sync.findOne(req.body.flyerId1)
	var flyer2 = models.Flyer.findById(req.body.flyerId2)
	var match = new models.Match({flyer1: flyer1, flyer2: flyer2})
	var user1 = models.User.findById(flyer1.user.id)
	var user2 = models.User.findById(flyer2.user.id)
	user1.matches.push(match)
	user2.matches.push(match)
	match.save(function (err, u) {
	  if (err) return console.error(err)
	})
	res.end('match saved')
	res.redirect('/user/profile/' + user.id)
})

router.get('/api/flyers/:id', function(req, res) {
	models.User.findById(req.params['id'], function(err, user) {
		var flyers = user.flyers
		console.log('flyers: ' + flyers)
		var results = []
		for (var i = 0; i < flyers.length; i++) {
			var index = flyers[i]
			models.Flyer.findOne({'_id': index}, function(err, flyer) {
				if (err) return console.error(err)
				console.log(flyer)
				results.push(flyer.want)
				if (results.length == flyers.length) res.send(results)
			})
		}
	})
})

//needs to be tested
router.get('/api/matches/:id', function(req, res) {
	var user = models.User.findById(req.params['id'])
	var match = user.matches
	res.send(matches)
})

//nees to be tested
router.post('/api/flyer/add-acceptance', function(req, res) {
	var user = models.User.findById(req.body.userId)
	var flyer = models.Flyer.findById(req.body.flyerId)
	flyer.acceptedBy.push(user)
	flyer.save(function (err, u) {
	  if (err) return console.error(err)
	})
})

//needs to be tested
router.get('/api/offers/:id', function(req, res) {
	//get potential matches
	//show the ones with most match potential first
	//don't show your own flyers
	var flyers = models.Flyer.find.where("user.id != #{req.params['id']")
	res.send(flyers)
})

module.exports = router
