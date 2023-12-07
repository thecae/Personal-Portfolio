/* Copyright G. Hemingway, 2023 - All rights reserved */
"use strict";

const Joi = require("joi");
const jwt = require("jsonwebtoken");

module.exports = (app) => {
  /**
   * Log a user in
   *
   * @param {req.body.username} Username of user trying to log in
   * @param {req.body.password} Password of user trying to log in
   * @return { 200, {username, primary_email} }
   */
  app.post("/api/session", async (req, res) => {
    // Validate incoming request has username and password, if not return 200:error:'username and password are required'
    const schema = Joi.object({
      username: Joi.string().lowercase().required(),
      password: Joi.string().required(),
    });
    try {
      // validate schema
      const data = await schema.validateAsync(req.body, { stripUnknown: true });

      try {
        // Search database for user
        let user = await app.models.User.findOne({ username: data.username });
        if (!user) return res.status(200).send({ error: "unauthorized" });

        if (!(await user.authenticate(data.password))) {
          // If not a match, return 200:error:'unauthorized'
          console.error(`Session.login failed.  Incorrect credentials.`);
          return res.status(200).send({ error: "unauthorized" });
        }
        // Regenerate session when signing in to prevent fixation
        req.session.regenerate(() => {
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
          // If a match, return 201:{ username, primary_email }
          return res.status(200).send({
            username: user.username,
            primary_email: user.primary_email,
          });
        });
      } catch (err) {
        console.error(err);
        return res.status(500).send({ error: "internal server error" });
      }
    } catch (err) {
      const message = err.details[0].message;
      console.error(`Session.login validation failure: ${message}`);
      return res.status(200).send({ error: message });
    }
  });

  /**
   * Get a user's session
   */
  app.get("/api/session", async (req, res) => {
    try {
      // get token from redis
      const id = await app.redis.get(`login:${req.signedCookies.login}`);
      if (!id) return res.status(200).send({});

      // if session exists, return user
      if (req.session.user) return res.status(200).send(req.session.user);

      // if session does not exist, create session
      if (id) {
        // get user from database
        const user = await app.models.User.findById(id);
        if (!user) return res.status(200).send({});

        // regenerate session
        req.session.regenerate(() => {
          req.session.user = user;
          console.log(`Session.login success: ${req.session.user.username}`);
          return res.status(200).send({
            username: user.username,
            primary_email: user.primary_email,
            first_name: user.first_name,
            last_name: user.last_name,
            city: user.city,
            games: user.games,
          });
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "internal server error" });
    }
  });

  /**
   * Log a user out
   *
   * @return { 204 if was logged in, 200 if no user in session }
   */
  app.delete("/api/session", async (req, res) => {
    if (req.session.user) {
      app.redis.del(`login:${req.cookies.login}`);
      res.clearCookie("login");
      req.session = null;
      return res.status(204).end();
    } else {
      return res.status(200).end();
    }
  });
};
