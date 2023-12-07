"use strict";

const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const ghConfig = {
  client_id: process.env.GHCONFIG_CLIENT,
  client_secret: process.env.GHCONFIG_SECRET,
  scope: "user:email",
  url: "https://cole-ellis.com/api/auth/github",
};

module.exports = (app) => {
  async function exchangeCode(code) {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: ghConfig.client_id,
        client_secret: ghConfig.client_secret,
        code,
      }),
    });
    if (res.ok) return await res.json();
    throw "checkCode error";
  }

  async function fetchProfile(token) {
    let res = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`,
      },
    });
    let profile = await res.json();
    if (!res.ok) throw new Error("checkProfile error");

    res = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `token ${token}`,
      },
    });
    let email = await res.json();
    if (!res.ok) throw new Error("checkProfile error");
    const primary = email.find((e) => e.primary);

    const newUser = {
      username: profile.login,
      primary_email: primary ? primary.email : email[0].email,
      github_user: true,
      first_name: profile.name ? profile.name.split(" ")[0] : "NULL",
      last_name: profile.name ? profile.name.split(" ")[1] : "NULL",
      city: profile.location ? profile.location : "NULL",
    };
    if (res.ok) return newUser;
  }

  /**
   * Callback from Github OAuth
   */
  app.get("/api/auth/github", async (req, res) => {
    if (!req.query.code)
      return res.status(200).send({ error: "no code provided" });
    try {
      const { access_token } = await exchangeCode(req.query.code);
      console.log("access_token: ", access_token);
      const profile = await fetchProfile(access_token);
      console.log("profile: ", profile);

      // check if user exists (if not, create)

      let user = await app.models.User.findOne(profile);
      if (!user) user = new app.models.User(profile);
      await user.save();

      // create session
      req.session.regenerate(async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: "Session regeneration failed" });
        }
        req.session.user = user;
        console.log(`Session.login success: ${req.session.user.username}`);
        // generate JWT token
        const token = jwt.sign({ username: user.username }, app.secret);
        // set cookie
        res.cookie("login", token, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 604800000, // week
          signed: true,
        });
        // store token in redis
        app.redis.set(`login:${token}`, user._id.toString());
        // redirect to profile
        return res.redirect(`/solitaire/profile/${user.username}`);
      });
    } catch (err) {
      console.error(`Error in Github OAuth: ${err}`);
      return res.status(200).send({ error: "internal server error" });
    }
  });

  /**
   * Github OAuth
   */
  app.get("/api/auth", async (req, res) => {
    // Generate a random string for state
    req.session.state = crypto.randomBytes(20).toString("hex");
    const url = `https://github.com/login/oauth/authorize?client_id=${ghConfig.client_id}&scope=${ghConfig.scope}&state=${req.session.state}&redirect_uri=${ghConfig.url}`;
    return res.status(200).send({ url });
  });
};
