"use strict";

require("dotenv").config();

const path = require("path");
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const pug = require("pug");

const port = process.env.PORT ? process.env.PORT : 8080;
const env = process.env.NODE_ENV ? process.env.NODE_ENV : "dev";

let app = express();
if (env !== "test") app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "../../public")));
app.engine("pug", pug.__express);
app.set("views", __dirname);
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));

// Import our routes
require("./routes.cjs")(app);

app.get("*", (req, res) => {
  res.render("base.pug", {});
});

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
