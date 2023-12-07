/* Copyright G. Hemingway, @2023 - All rights reserved */
"use strict";

import md5 from "md5";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";

/**
 * @return {string}
 */
export function GravHash(email, size) {
  let hash = email && email.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
  hash = hash && hash.toLowerCase();
  hash = hash && md5(hash);
  return `https://www.gravatar.com/avatar/${hash}?size=${size}`;
}

const HeaderLeft = ({ user }) => {
  return (
    <div className="flex-grow italic">
      {user !== "" ? (
        <Link to={`/solitaire/profile/${user}`} className="text-nightfall-keyword">
          <h2 className="text-2xl font-bold m-2">ColeCard</h2>
        </Link>
      ) : (
        <h2 className="text-nightfall-keyword text-2xl font-bold m-2">ColeCard</h2>
      )}
    </div>
  );
};

HeaderLeft.propTypes = {
  user: PropTypes.string,
};

/*************************************************************************/

const HeaderRight = ({ user, email }) => {
  const isLoggedIn = user !== "";
  return (
    <div className={"flex flex-row justify-center items-center pr-2 h-11"}>
      {isLoggedIn ? (
        <Fragment>
          <Link to="/solitaire/logout" className="text-nightfall-keyword pr-2">
            Log Out
          </Link>
          <Link to={`/solitaire/profile/${user}`} className="items-center">
            <img
              alt="go to profile"
              src={GravHash(email, 40)}
              className="rounded-full"
            />
          </Link>
        </Fragment>
      ) : (
        <Fragment>
          <Link id="loginLink" to="login" className="text-nightfall-keyword px-5">
            Log In
          </Link>
          <Link id="regLink" to="register" className="text-nightfall-keyword px-5">
            Register
          </Link>
        </Fragment>
      )}
    </div>
  );
};

HeaderRight.propTypes = {
  user: PropTypes.string,
  email: PropTypes.string,
};

const Header = ({ user = "", email = "" }) => (
  <div className="flex mx-auto justify-between max-w-5xl items-center static w-full px-5">
    <HeaderLeft user={user} />
    <HeaderRight user={user} email={email} />
  </div>
);

Header.propTypes = {
  user: PropTypes.string,
  email: PropTypes.string,
};

export default Header;