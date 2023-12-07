"use strict";

import React from "react";
import { Link } from "react-router-dom";

const Item = ({ to, image, text }) => (
  <Link
    className="text-white no-underline h-36 shadow-md text-xl rounded-3xl border-none inline-block py-2 px-4 bg-cover bg-center w-full"
    style={{ backgroundImage: `url(${image})` }}
    to={to}
  >
    <strong className="text-4xl font-bold text-shadow-lg">{text}</strong>
  </Link>
);

const Home = () => (
  <div className="flex flex-col justify-center items-center mx-auto w-3/4 my-12">
    <div className="text-center mb-12">
      <h1 className="text-6xl text-nightfall-function font-bold my-3 italic">
        Hello! Welcome to my page.
      </h1>
      <h3 className="text-lg font-light italic text-nightfall-string">
        Here you can find some of my current passion projects. I have a
        Cybersecurity notes repository to teach the basics of low-level
        programming, binary exploitation, and reverse engineering. I have a list
        of CTF write-ups I am proud of, which will continue to grow as I do more
        CTFs. I have a blog containing reviews of various escape rooms I've
        completed. Finally, my personal portfolio is a visual of my CS resume
        and the projects, experiences, and skills I have.
      </h3>
    </div>
    <div className="w-full">
      <h1 className="text-center font-bold text-3xl mb-5 text-nightfall-keyword">
        Navigation
      </h1>
      <div className="grid grid-cols-2 gap-4 pb-4">
        <Item
          to="https://cyber.cole-ellis.com"
          image="/assets/home/wp-cyber.png"
          text="Cybersecurity Notes"
        />
        <Item
          to="https://ctf.cole-ellis.com"
          image="/assets/home/wp-ctf.jpg"
          text="CTF Write-Ups"
        />
        <Item
          to="https://r2.cole-ellis.com"
          image="/assets/home/wp-r2.png"
          text="Radare2 Guide"
        />
        <Item
          to="https://gdb.cole-ellis.com"
          image="/assets/home/wp-gef.png"
          text="GDB Guide"
        />
        <Item
          to="/portfolio"
          image="/assets/home/wp-portfolio.jpg"
          text="Portfolio Site"
        />
        <Item
          to="/escape"
          image="/assets/home/wp-escape.png"
          text="Escape Room Blogs"
        />
        <Item
          to="/solitaire"
          image="/assets/home/wp-solitaire.png"
          text="Solitaire Game"
        />
      </div>
    </div>
  </div>
);

export default Home;
