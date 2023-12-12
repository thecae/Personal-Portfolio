"use strict";

const fs = require("fs");
const greyMatter = require("gray-matter");
const path = require("path");

module.exports = (app) => {
  /**
   * GET /api/blog/:slug
   * Gets one blog post by its slug
   */
  app.get("/api/blog/:slug", (req, res) => {
    try {
      const { slug } = req.params;
      const fileContents = fs.readFileSync(
        path.join(__dirname, "../../blog", `${slug}.md`),
        "utf8"
      );
      const { data, content } = greyMatter(fileContents);
      return res.status(200).send({ ...data, content });
    } catch (err) {
      return res.status(404).send({ error: "unknown blog post" });
    }
  });

  /**
   * GET /api/blog
   * Gets all blog posts
   */
  app.get("/api/blog", (req, res) => {
    // get all files in blog directory
    const files = fs.readdirSync(path.join(__dirname, "../../blog"));
    let blogs = [];
    files.forEach((file) => {
      if (file.split(".").pop() !== "md") return;
      const fileContents = fs.readFileSync(
        path.join(__dirname, "../../blog", file),
        "utf8"
      );
      const { data } = greyMatter(fileContents);
      blogs.push(data);
    });
    return res.status(200).send(blogs);
  });
};
