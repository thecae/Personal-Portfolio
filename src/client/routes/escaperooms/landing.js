"use strict";

import React from "react";
import { Link, useNavigate } from "react-router-dom";

const LandHead = () => (
  <div className="flex flex-col justify-center items-center py-12">
    <h1 className="text-center text-5xl font-bold mb-3">
      Cole's Escape Room Blog
    </h1>
    <p className="text-center block text-lg italic">
      Thanks for visiting my escape room blog! As I continue to do more escape
      rooms around the country (and hopefully around the world), I plan to
      continue to document my experiences here. I hope you find these reviews
      helpful in your exploration of escape rooms! ~Cole
    </p>
    <Link
      className="block text-center text-white no-underline rounded-3xl py-2 px-4 border-none my-5 bg-[#2b2c40]"
      to={"https://morty.app/@CaptainEllis"}
    >
      <div className="flex justify-between">
        <img
          src={"/assets/morty.jpg"}
          className="w-7 h-7 inline-block mr-2"
          alt="morty icon"
        />
        <p className="text-center justify-center">Add Me on Morty!</p>
      </div>
    </Link>
  </div>
);

const SpotlightBlog = ({ blog }) => (
  <Link
    className="text-white no-underline h-48 shadow-md text-xl rounded-3xl border-none inline-block py-2 px-4 bg-cover bg-center"
    style={{ backgroundImage: `url(/assets/blogs/${blog.image})` }}
    to={`/escape/blog/${blog.slug}`}
  >
    <strong>{blog.name}</strong>
    <br />
    {blog.location}
  </Link>
);

const Spotlight = ({ blogs }) => (
  <div className="grid grid-cols-2 gap-4 pb-4">
    {blogs.map((blog) => (
      <SpotlightBlog key={blog.slug} blog={blog} />
    ))}
  </div>
);

const RemainderBlog = ({ blog }) => (
  <Link
    className="text-white no-underline h-24 shadow-md text-xl rounded-3xl border-none inline-block py-2 px-4 bg-cover bg-center"
    to={`/escape/blog/${blog.slug}`}
    style={{ backgroundImage: `url(/assets/blogs/${blog.image})` }}
  >
    <strong>{blog.name}</strong>
    <br />
    {blog.location}
  </Link>
);

const Remainder = ({ blogs }) => (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
    {blogs.map((blog) => (
      <RemainderBlog key={blog.slug} blog={blog} />
    ))}
  </div>
);

const LandBody = ({ blogs }) => (
  <>
    <h1 className="text-center font-bold text-3xl mb-5">Latest Articles</h1>
    <Spotlight blogs={blogs.slice(0, 4)} />
    <Remainder blogs={blogs.slice(4)} />
  </>
);

const EscapeRooms = () => {
  const [blogs, setBlogs] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetch("/api/blog")
      .then((res) => {
        if (res.status === 200) return res.json();
        else navigate("/404");
      })
      .then((data) => setBlogs(data))
      .catch((err) => console.log(err));
  }, []);

  // ignore the pre-render
  if (blogs.length === 0) return;

  // sort the blogs by date
  blogs.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <div className="px-4 mx-auto pb-12 max-w-5xl">
      <LandHead />
      <LandBody blogs={blogs} />
    </div>
  );
};

export default EscapeRooms;
