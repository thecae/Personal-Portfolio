/* Copyright G. Hemingway, 2023 - All rights reserved */
"use strict";

const Joi = require("joi");
const { filterGameForProfile } = require("./solitaire.cjs");
const sharedPromise = import("../../../shared/index.js");

module.exports = (app) => {
  // Schema for user info validation
  const schema = Joi.object({
    username: Joi.string().lowercase().alphanum().min(3).max(32).required(),
    primary_email: Joi.string().lowercase().email().required(),
    first_name: Joi.string().allow(""),
    last_name: Joi.string().allow(""),
    city: Joi.string().default(""),
    password: Joi.string().min(8).required(),
  });

  /**
   * Create a new user
   *
   * @param {req.body.username} Display name of the new user
   * @param {req.body.first_name} First name of the user - optional
   * @param {req.body.last_name} Last name of the user - optional
   * @param {req.body.city} City user lives in - optional
   * @param {req.body.primary_email} Email address of the user
   * @param {req.body.password} Password for the user
   * @return {201, {username,primary_email}} Return username and others
   */
  app.post("/api/user", async (req, res) => {
    const { validPassword } = await sharedPromise;
    // Validate user input
    let data;
    try {
      data = await schema.validateAsync(req.body, { stripUnknown: true });
      // Deeper password validation
      const pwdErr = validPassword(data.password);
      if (pwdErr) {
        console.error(
          `User.create password validation failure: ${pwdErr.error}`
        );
        return res.status(200).send({ error: pwdErr });
      }
    } catch (err) {
      const message = err.details[0].message;
      console.error(`User.create validation failure: ${message}`);
      return res.status(200).send({ error: message });
    }

    // Try to create the user
    try {
      let user = new app.models.User(data);
      await user.save();

      // Send the happy response back
      return res.status(201).send({
        username: data.username,
        primary_email: data.primary_email,
      });
    } catch (err) {
      console.error(err);
      // Error if username is already in use
      if (err.code === 11000) {
        if (err.message.indexOf("username_1") !== -1)
          return res.status(200).send({ error: "username already in use" });
        if (err.message.indexOf("primary_email_1") !== -1)
          return res.status(200).send({ error: "email address already in use" });
      }
      // Something else in the username failed
      else return res.status(200).send({ error: "invalid username" });
    }
  });

  /**
   * See if user exists
   *
   * @param {req.params.username} Username of the user to query for
   * @return {200}
   */
  app.head("/api/user/:username", async (req, res) => {
    let user = await app.models.User.findOne({
      username: req.params.username.toLowerCase(),
    });
    if (!user)
      return res.status(200).send({ error: `unknown user: ${req.params.username}` });
    else return res.status(200).end();
  });

  /**
   * Fetch user information
   *
   * @param {req.params.username} Username of the user to query for
   * @return {200, {username, primary_email, first_name, last_name, city, games[...]}}
   */
  app.get("/api/user/:username", async (req, res) => {
    let user = await app.models.User.findOne({
      username: req.params.username.toLowerCase(),
    })
      .populate("games")
      .exec();

    if (!user)
      return res.status(200).send({ error: `unknown user: ${req.params.username}` });
    else {
      // Filter games data for only profile related info
      const filteredGames = user.games.map((game) =>
        filterGameForProfile(game)
      );
      return res.status(200).send({
        username: user.username,
        primary_email: user.primary_email,
        first_name: user.first_name,
        last_name: user.last_name,
        city: user.city,
        games: filteredGames,
      });
    }
  });

  /**
   * Update a user's profile information
   *
   * @param {req.body.first_name} First name of the user - optional
   * @param {req.body.last_name} Last name of the user - optional
   * @param {req.body.city} City user lives in - optional
   * @return {200, username} Return status only
   */
  app.put("/api/user", async (req, res) => {
    if (!req.session.user)
      return res.status(200).send({ error: "unauthorized" });

    const schema = Joi.object({
      username: Joi.string().required(),
      first_name: Joi.string().allow(""),
      last_name: Joi.string().allow(""),
      city: Joi.string().allow(""),
      primary_email: Joi.string().email().allow(""),
    });

    // Validate user input
    let data;
    try {
      data = await schema.validateAsync(req.body, { stripUnknown: true });
    } catch (err) {
      const message = err.details[0].message;
      console.error(`User.update validation failure: ${message}`);
      return res.status(200).send({ error: message });
    }

    // extract username and remove from data
    const username = data.username;
    delete data.username;

    try {
      const user = await app.models.User.findOneAndUpdate(
        { username: username.toLowerCase() },
        data,
        { new: true }
      );
      if (!user) return res.status(200).send({ error: "unknown user" });
      await user.save();
      req.session.user = user;
      return res.status(200).send({ username: user.username });
    } catch (err) {
      console.error(
        `User.update logged-in user not found: ${req.session.user.id}`
      );
      return res.status(200).send({ error: "internal server error" });
    }
  });
};
