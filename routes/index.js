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

router.get('/offers/:id', function(req, res) {
	res.render('index2.html')
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
	models.Flyer.findOne({'_id': req.body.flyerId1}, function(err, flyer1) {
		models.Flyer.findOne({'_id': req.body.flyerId2}, function(err, flyer2) {
			var match = new models.Match({flyer1: flyer1, flyer2: flyer2})
			models.User.findOne({'_id': flyer1.user.id}, function(err, user1) {
				user1.matches.push(match)
				models.User.findById({'_id': flyer2.user.id}, function(err, user2) {
						user2.matches.push(match)
						match.save(function (err, u) {
						  if (err) return console.error(err)
						  res.end('match saved')
							res.redirect('/user/profile/' + user.id)
						})
				})
			})
		})
	})
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

router.post('/api/flyer/add-acceptance', function(req, res) {
	models.User.findOne({'_id': req.body.uid}, function(err, user) {
		models.Flyer.findOne({'_id': req.body.id}, function(err, flyer) {
			flyer.acceptedBy.push(user)
			flyer.save(function (err, f) {
			if (err) return console.error(err)
			models.User.findOne({'_id': flyer.user}, function(err, accepted_user) {
				models.Flyer.find({'user': user._id}, function(err, user_flyers) {
					var sema = 0;
					for (var i = 0; i < user_flyers.length; i++) {
						if (user_flyers[i].acceptedBy.indexOf(accepted_user) != -1) {
							//match!!!!
							var match = new models.Match({flyer1: flyer, flyer2: user_flyers[i]})
							sema ++;
							match.save(function (err, m) {
									if (err) return console.error(err)
									user.matches.push(match)
									user.save(function (err, u) {
										accepted_user.matches.push(match)
										accepted_user.save(function (err, au) {
											sema--;
											if (sema == 0) res.end('match saved');
										})
									})
								})
							}
						}
						if (sema == 0) res.end('match saved');
					})
				})
			})
		})
	})
})

router.get('/api/offers/:id', function(req, res) {
	//get potential matches
	//show the ones with most match potential first
	//don't show your own flyers
	models.Flyer.find({}, function(err, flyers) {
		var results = []
		for (var i = 0; i < flyers.length; i++) {
			var flyer = flyers[i]
			models.User.findOne({'_id': flyer.user}, function(err, user) {
				results.push({
					id: flyer._id,
					user_id: user._id,
					user_name: user.name,
					user_description: user.description,
					user_photo: user.photo,
					want: flyer.want
				})
				if (results.length == flyers.length) res.send(results)
			})
		}
	})
})

module.exports = router
