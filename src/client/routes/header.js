"use strict";

import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

const HeaderLogo = ({ img, url }) => (
  <Link className="w-11 h-11 px-2" to={url}>
    <img className="w-full h-full object-contain" src={img} alt="Logo" />
  </Link>
);

HeaderLogo.propTypes = {
  img: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

const HeaderLink = ({ name, url }) => (
  <Link className="text-white no-underline" to={url}>
    {name}
  </Link>
);

HeaderLink.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

const Header = () => {
  return (
    <nav className="flex p-0 h-11 w-full bg-nightfall-highlight">
      <div className="flex mx-auto justify-between max-w-5xl items-center static w-full px-5">
        <HeaderLogo img={"/assets/logo.png"} url={"/"} />
        <HeaderLink name={"Cyber Notes"} url={"https://cyber.cole-ellis.com"} />
        <HeaderLink name={"CTF Write-Ups"} url={"https://ctf.cole-ellis.com"} />
        <HeaderLink name={"Escape Room Blog"} url={`/escape`} />
        <HeaderLink name={"Personal Portfolio"} url={`/portfolio`} />
        <HeaderLink name={"Contact"} url={`/contact`} />
      </div>
    </nav>
  );
};

export default Header;
