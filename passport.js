const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("./models/modelUser.js")
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



passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});