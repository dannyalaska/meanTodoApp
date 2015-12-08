var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  todos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Todos'
  }]
});

UserSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next();

    bcrypt.hash(user.password, salt, function(err, hashedPassword) {
      if (err) return next();

      user.password = hashedPassword;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(userPassword, cb) {
  bcrypt.compare(userPassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = User;
