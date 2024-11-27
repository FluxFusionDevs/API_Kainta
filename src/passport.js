const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const AppleStrategy = require('passport-apple').Strategy;
const userService = require("./services/userService");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (userr, done) => {
  try {
    const user = await userService.getUserById(userr._id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await userService.getUserById(payload.sub);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        const user = await userService.findGoogleUser(profile.id);
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
