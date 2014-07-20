var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/user/create', function(req, res) {
	res.render('create_user');
});

router.post('/api/user/create', function(req, res) {
	var name = req.body.name
	var photo = req.body.photoUrl
	var description = req.body.description
	var contact = req.body.contact
	var u = new models.User({name: name, photo: photo, description: description, contact: contact})
	u.save(function (err, u) {
	  if (err) return console.error(err);
	  console.log('papas fritas')
	});
	var users = models.User.find(function (err, users) {
	  if (err) return console.error(err);
	  console.log(users)
	})
	res.end('user saved')
});

module.exports = router;
