var express = require('express')
var router = express.Router()

var models = require('../models')

router.get('/', function(req, res) {
	var skills = ["iOS", "JavaScript", "CSS", "C++", "Salsa", "Knitting", "Kayaking", "Surfing", "Painting"]

	//create users
	var users = [
		new models.User({name: "Jessica", photo: "http://api.randomuser.me/portraits/med/women/12.jpg", description: "Hi! I'm an entry level software engineer interested in honing my dev skills", contact: "(344)-635-5745"}),
		new models.User({name: "Casey", photo: "http://api.randomuser.me/portraits/med/men/12.jpg", description: "I'm a Junior interested in Electrical Engineering and watercolor painting.", contact: "(510)-200-1728"}),
		new models.User({name: "Paul", photo: "http://api.randomuser.me/portraits/med/men/86.jpg", description: "DevOps Engineer @Fastly!", contact: "(201)-442-6033"}),
		new models.User({name: "Estefania", photo: "http://api.randomuser.me/portraits/med/women/80.jpg", description: "CEO Yahoo!", contact: "(677)-383-4145"}),
		new models.User({name: "Alma", photo: "http://api.randomuser.me/portraits/med/women/94.jpg", description: "Cardiologist", contact: "(812)-101-9559"}),
		new models.User({name: "Miguel", photo: "http://api.randomuser.me/portraits/med/men/15.jpg", description: "I'm am a medical doctor and I love to surf!", contact: "(131)-391-8570"}),
		new models.User({name: "Bob", photo: "http://api.randomuser.me/portraits/med/men/45.jpg", description: "I'm an investment banker interested in Salsa!", contact: "(911)-833-8188"})
	];
	for (var i in users) {
  		users[i].save();

  		var rand_index = Math.floor(Math.random()*skills.length)
  		var flyer = new models.Flyer({want: skills[rand_index], user: users[i]._id, acceptedBy: []})
  		console.log("Rand skill: " + skills[rand_index])
  		flyer.save();
  	}
	res.end('done')
});

module.exports = router


