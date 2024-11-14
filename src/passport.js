const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const AppleStrategy = require('passport-apple').Strategy;
const userService = require("./services/userService");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (user, done) => {
  try {
    const user = await userService.getUserById(user.id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        let user = await userService.findGoogleUser(profile.id);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// passport.use(new AppleStrategy({
//   clientID: process.env.APPLE_CLIENT_ID, // Your Services ID
//   teamID: process.env.APPLE_TEAM_ID, // Your Apple Developer Team ID
//   keyID: process.env.APPLE_KEY_ID, // Your Key ID
//   privateKey: process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Your private key
//   callbackURL: "http://localhost:3000/auth/apple/callback", // Your callback URL
// },
// async (accessToken, refreshToken, idToken, profile, done) => {
//   try {
//       // Use the profile information to find or create a user
//       let user = await userService.findOrCreateUser(profile);
//       done(null, user);
//   } catch (error) {
//       done(error, null);
//   }
// }));

module.exports = passport;
