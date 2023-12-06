"use strict";

import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

const Summary = ({ site, loc }) => (
  <div>
    <h3 className="font-bold mt-1 mb-0 text-gray-500 text-sm">
      {site.toUpperCase()}
    </h3>
    <h3 className="font-semibold mt-1 mb-0 text-gray-500 text-sm">{loc}</h3>
  </div>
);

const PageHeader = ({ blog }) => (
  <div className="block pt-12">
    <Summary site={blog.site} loc={blog.location}></Summary>
    <h1 className="mb-2 mt-8 text-6xl font-extrabold">{blog.name}</h1>
    <p className="my-0 text-xl font-medium">{blog.description}</p>
  </div>
);

const Blog = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then((res) => {
        if (res.status === 200) return res.json();
        else navigate("/404");
      })
      .then((data) => setBlog(data))
      .catch((err) => console.log(err));
  }, []);

  if (blog === null) return;

  return (
    <div className="justify-center max-w-3xl mx-auto px-4 items-center">
      <PageHeader blog={blog} />
      <img
        className="block mx-auto rounded-3xl max-h-96 my-8"
        src={`/assets/blogs/${blog.image}`}
        alt={`${blog.name}: Image`}
      />
      <Markdown>{blog.content}</Markdown>
    </div>
  );
};

export default Blog;
