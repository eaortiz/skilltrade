var express = require('express');
var router = express.Router();

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
	res.end('name' + name)
});

module.exports = router;
