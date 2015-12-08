var express = require('express');
var logger = require('morgan');
var session = require('express-session');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./public/models/user.js');
var app = express();

app.use(logger('dev'));

app.use(session({
  secret: 'dannyisawesome',
  saveUninitialized: false,
  resave: false
}));

app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/meanTodoApp', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('MongoDB connection: successful!');
  }
});

app.use(express.static('./public'));

app.get('/users', function(req, res) {
  if (req.session.currentUser) {
    User.findbyId(req.session.currentUser, function(err, user) {
      res.send(user);
    });
  } else {
    res.status(404);
    res.send({err:404, msg:'Not logged in.'});
  }
});

app.post('/sessions', function(req, res) {
  User.find({username: req.body.username}).exec(function(err, user) {
    if (user[0]) {
      user[0].comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch) {
          req.session.currentUser = user[0].id;
          res.send('This user successfully logged in: ' + user[0].username);
        } else {
          res.status(404);
          res.send({
            err: 404,
            msg: 'Incorrect Password!'
          });
        }
      });
    } else {
      res.status(400).send('Unregistered User!');
    }
  });
});

app.delete('/sessions', function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      res.status(400);
      res.send({err: 400, msg: 'Logout error'});
    } else {
      res.send('User has successfully logged out.');
    }
  });
});

app.listen(7777, function() {
  console.log('Something is happening port 7777...');
});
