// Create an admin user so exploit can be successful
// "borrowed" from HackMIT reg system (the create default user not the exploit part :P). thx edwin.

ADMIN_USERNAME = 1
ADMIN_PASSWORD = 1

// Create a default admin user.
var Admin= require('../models/Admin');

// If there is already a user
Admin
  .findOne({
    email: ADMIN_USERNAME
  })
  .exec(function(err, admin){
    if (!admin){
      var u = new Admin();
      u.username = ADMIN_USERNAME;
      u.password = ADMIN_PASSWORD;
      u.save(function(err){
        if (err){
          console.log(err);
        }
      });
    }
  });
