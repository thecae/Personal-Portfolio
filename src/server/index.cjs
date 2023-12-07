"use strict";

require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const logger = require("morgan");
const bodyParser = require("body-parser");
const pug = require("pug");
const mongoose = require("mongoose");
const redis = require("redis");

const port = process.env.PORT ? process.env.PORT : 8080;
const env = process.env.NODE_ENV ? process.env.NODE_ENV : "dev";

const setup = async () => {
  let app = express();
  if (env !== "test") app.use(logger("dev"));
  app.use(express.static(path.join(__dirname, "../../public")));
  app.engine("pug", pug.__express);
  app.set("views", __dirname);

  // setup session support
  app.store = session({
    name: "session",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: "/",
    },
  });
  app.use(app.store);

  // body-parser
  app.use(bodyParser.json({}));
  app.use(bodyParser.urlencoded({ extended: true }));

  // cookie-parser
  const cookieParser = require("cookie-parser");
  app.use(cookieParser(process.env.COOKIE_SECRET));

  // connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    mongoose.connection.on("disconnected", () => {
      console.log(`MongoDB disconnected`);
    });
    console.log(`MongoDB connected: ${process.env.MONGODB_URI}`);
  } catch (err) {
    console.log(err);
    process.exit(-1);
  }

  // Import our Data Models
  app.models = {
    Game: require("./models/game.cjs"),
    Move: require("./models/move.cjs"),
    User: require("./models/user.cjs"),
    MoveStack: require("./models/move_stack.cjs"),
  };

  // connect to Redis
  try {
    const client = redis.createClient({ url: process.env.REDIS_URI });
    await client.connect();

    app.redis = client;
    app.secret = process.env.JWT_SECRET;
    console.log(`Redis connected: ${process.env.REDIS_URI}`);

    // Log when connected to redis
    client.on("error", (err) => {
      console.log(err);
      process.exit(-1);
    });
  } catch (err) {
    console.log(err);
    process.exit(-1);
  }

  // Import our routes
  require("./routes.cjs")(app);

  app.get("*", (req, res) => {
    res.render("base.pug", {});
  });

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};

setup();
