import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_BASE_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google Profile:", profile); // ✅ Inspect this in your terminal

        const email = profile.emails?.[0]?.value;

        if (!email) {
          console.error("❌ No email found in Google profile");
          return done(new Error("No email found in Google profile"), null);
        }

        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.findOne({ email });

          if (user && !user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
        }

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            fullName: profile.displayName || "Unnamed User",
            email,
            profilePic: profile.photos?.[0]?.value || "",
            password: undefined,
          });
        }

        return done(null, user);
      } catch (err) {
        console.error("GoogleStrategy error:", err);
        return done(err, null);
      }
    }
  )
);
