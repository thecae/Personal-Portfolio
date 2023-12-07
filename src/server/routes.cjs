"use strict";

module.exports = (app) => {
  require("./api/blog/blog.cjs")(app);
  require("./api/solitaire/auth.cjs")(app);
  require("./api/solitaire/game.cjs")(app);
  require("./api/solitaire/session.cjs")(app);
  require("./api/solitaire/user.cjs")(app);
};
