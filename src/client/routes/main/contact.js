"use strict";

import React from "react";
import { Link } from "react-router-dom";

const Contact = () => (
  <div className="flex flex-col justify-center items-center mx-auto w-3/4 my-12">
    <div className="text-center">
      <h1 className="text-7xl font-extrabold my-3 text-nightfall-function">
        Say Hello!
      </h1>
      <h3 className="font-semibold text-3xl italic">
        I am currently seeking new opportunities.
      </h3>
    </div>
    <div className="text-center my-12">
      <p className="text-lg text-nightfall-string">
        I am currently looking for new opportunities in the Cybersecurity
        industry, both red-teaming and blue-teaming. I am also interested in
        working open-source projects in Cybersecurity, artificial intelligence,
        or general software engineering projects.
        <br />
        <br />I am always open for new contracts to design escape rooms. I have
        an arsenal of new ideas and props to build.
        <br />
        <br />
        And, if you happen to be American Ninja Warrior Casting, I will be the
        next American Ninja Warrior and am ready for my shot.
      </p>
    </div>
    <div className="flex justify-between w-full">
      <Link to={"mailto:cole.a.ellis@vanderbilt.edu"}>
        <img
          className="object-contain w-24 h-24 rounded-3xl"
          src="/assets/home/mail.png"
          alt="Email Me"
        />
      </Link>
      <Link to={"https://wakatime.com/@thecae"}>
        <img
          className="object-contain w-24 h-24 rounded-full"
          src="/assets/home/wakatime.png"
          alt="Wakatime"
        />
      </Link>
      <Link to={"https://github.com/thecae"}>
        <img
          className="object-contain w-24 h-24 rounded-full"
          src="/assets/home/github.png"
          alt="GitHub"
        />
      </Link>
      <Link to={"https://morty.app/@CaptainEllis"}>
        <img
          className="object-contain w-24 h-24 rounded-full"
          src="/assets/home/morty.png"
          alt="Morty"
        />
      </Link>
      <Link to={"https://linkedin.com/in/cole-ellis-2024/"}>
        <img
          className="object-contain w-24 h-24 rounded-3xl"
          src="/assets/home/linkedin.png"
          alt="LinkedIn"
        />
      </Link>
    </div>
  </div>
);

export default Contact;
