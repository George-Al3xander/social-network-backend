const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const User = require("./models/modelUser.js")
const bcrypt = require("bcryptjs")
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ['profile', 'email',"openid"],
    },
    function (accessToken, refreshToken, profile, done) {
      let user = profile;
      const email = user.emails.filter((email) => email.verified)[0].value;
      User.find({email}).then((users) => {
        if(users.length > 0) {
          console.log('Signed with google before')
          User.find({email}).then((userDb) => {
            userDb = userDb[0];
            done(null, userDb);
          })
          .catch((error) => console.log("Invalid email"))
        } else {
          console.log('First time login with google')
          user = {
            name: {
                  first: user.name.givenName,
                  last: user.name.familyName,                
              }, 
            email, 
            provider: user.provider,
            avatar: user.photos[0].value
           } 
           console.log(user)
            new User(user).save()
            .then((res) => console.log("User saved"))
            .then(() => {
              User.find({email}).then((userDb) => {
                userDb = userDb[0];
                done(null, userDb);
              })
            })
            .catch((error) => console.log(error))
        }
      }) 
    }
  )
);

passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
  },
  function(username, password, done) {
    User.findOne({ email: username })
    .then(async (user) => {              
           try {
                if(await bcrypt.compare(password, user.password)) {              
                  console.log("All good")   
                  user.password = undefined 
                  user.avatar = undefined 
                 // console.log(user)
                  return done(null, user);
                } else {
                  console.log("Shit happens")                         
                  return done(null, false)
                }
           } catch (error) {
              console.log("Shit happens 2")   
                console.log(error)  
               //return done({msg: "Incorrect email or password"})
               return done(null, false)
           }
                
    })
    .catch((err) =>  done(err))
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {  
  done(null, user);
});