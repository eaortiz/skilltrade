var express = require('express')
var router = express.Router()
var models = require('../models')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' })
});

router.get('/user/create', function(req, res) {
	res.render('create_user')
});

router.post('/api/user/create', function(req, res) {
	var name = req.body.name
	var photo = req.body.photoUrl
	var description = req.body.description
	var contact = req.body.contact
	var u = new models.User({name: name, photo: photo, description: description, contact: contact})
	u.save(function (err, u) {
	  if (err) return console.error(err)
	})
	res.end('user saved')
})

router.post('/api/flyer/create', function(req, res) {
	var user = models.User.findById(req.body.userId)
	var want = req.body.want
	var flyer = new models.Flyer({user: user, want: want})
	flyer.save(function (err, u) {
	  if (err) return console.error(err)
	})
	user.flyers.push(flyer)
	user.save(function (err, u) {
	  if (err) return console.error(err)
	})
	res.end('flyer saved and added to user')
})

router.get('api/flyers', function(req, res) {
	var user = models.User.findById(req.body.userId)
	var flyers = user.flyers
	res.send(flyers)
})

router.post('api/flyer/add-acceptance', function(req, res) {
	var user = models.User.findById(req.body.userId)
	var flyer = models.Flyer.findById(req.body.flyerId)
	flyer.acceptedBy.push(user)
	flyer.save(function (err, u) {
	  if (err) return console.error(err)
	})
})

router.post('/api/match/create', function(req, res) {
	var flyer1 = models.Flyer.findById(req.body.flyerId1)
	var flyer2 = models.Flyer.findById(req.body.flyerId2)
	var match = new models.Match({flyer1: flyer1, flyer2: flyer2})
	match.save(function (err, u) {
	  if (err) return console.error(err)
	})
	res.end('match saved')
})

module.exports = router
