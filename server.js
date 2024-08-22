const express = require("express");
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2").Strategy;

const cors = require("cors");

const app = express();
const port = 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// Session setup
app.use(
  session({
    secret: "keyboard-car",
    resave: false,
    saveUninitialized: true,
  })
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

const AUTH_SCH_URL = "https://kamuth.vercel.app";

passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: `${AUTH_SCH_URL}/site/login`,
      tokenURL: `${AUTH_SCH_URL}/oauth2/token`,
      clientID: `http://localhost:3000/login/callback`,
      clientSecret: "123456",
      scope: ["basic", "displayName"],
      callbackURL: `http://localhost:${port}/auth/callback`,
      redirect_uri: `http://localhost:${port}/auth/callback`,
    },
    async (accessToken, refreshToken, _profile, done) => {
      const responseUser = await fetch(
        `${AUTH_SCH_URL}/api/profile?access_token=${accessToken}`
      ).then((res) => res.json());

      done(null, { ...responseUser, accessToken, refreshToken });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// OAuth routes
app.get("/auth/login", passport.authenticate("oauth2"));

app.get("/auth/callback", function (req, res, next) {
  passport.authenticate("oauth2", function (err, user, info, status) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/signin");
    }
    res.json({ ...user, login: true });
  })(req, res, next);
});

app.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

// Auth guard for /api/data
app.get("/api/data", (req, res) => {
  const rawUser = req.headers.authorization?.slice("Bearer ".length) ?? "";
  if (!rawUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const user = JSON.parse(Buffer.from(rawUser, "base64").toString());

  console.log("user", user);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json({ message: "Hello, " + rawUser });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
