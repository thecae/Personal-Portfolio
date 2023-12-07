/* Copyright G. Hemingway, @2023 - All rights reserved */
"use strict";

import PropTypes from "prop-types";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/header.js";

const Game = lazy(() => import("./components/game.js"));
const Landing = lazy(() => import("./components/landing.js"));
const Login = lazy(() => import("./components/login.js"));
const Logout = lazy(() => import("./components/logout.js"));
const Profile = lazy(() => import("./components/profile.js"));
const Register = lazy(() => import("./components/register.js"));
const Results = lazy(() => import("./components/results.js"));
const Start = lazy(() => import("./components/start.js"));

const defaultUser = {
  username: "",
  first_name: "",
  last_name: "",
  primary_email: "",
  city: "",
  games: [],
};

const Fallback = () => (
  <div className="flex justify-center items-center h-screen text-5xl text-nightfall-comment font-light">
    Loading ..
  </div>
);

/***
 *
 * @param user
 * @param children
 * @returns {JSX.Element|*}
 * @constructor
 */
const ReqUser = ({ user, children }) =>
  !user || user.username === "" ? (
    <Navigate to={"/solitaire/login"} replace={true} />
  ) : (
    children
  );

ReqUser.propTypes = {
  user: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

/***
 *
 * @param loggedIn
 * @param username
 * @returns {JSX.Element}
 * @constructor
 */
const CheckRegister = ({ loggedIn, username }) =>
  loggedIn ? (
    <Navigate to={`/solitaire/profile/${username}`} replace={true} />
  ) : (
    <Register />
  );

/***
 * Main application entry point
 * @returns {JSX.Element}
 * @constructor
 */
const Solitaire = () => {
  let [state, setState] = useState(defaultUser);
  // Make call to backend checking for login sessions
  const checkSession = async () => {
    try {
      const res = await fetch("/api/session", {
        method: "get",
        credentials: "include",
      });
      const data = await res.json();
      if ("error" in data) return;
      setState(data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    checkSession();
  }, []);

  // Helper to check if the user is logged in or not
  const loggedIn = () => {
    return state.username && state.primary_email;
  };

  // Helper to manage what happens when the user logs in
  const logIn = async (username) => {
    const response = await fetch(`/api/user/${username}`);
    const user = await response.json();
    setState(user);
  };

  // Helper for when a user logs out
  const logOut = async () => {
    // Reset user state
    setState(defaultUser);
    // delete the cookie
    await fetch("/api/session", {
      method: "delete",
      credentials: "include",
    });
  };

  return (
    <>
      <Header user={state.username} email={state.primary_email} />
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route path="login" element={<Login logIn={logIn} />} />
          <Route path="logout" element={<Logout logOut={logOut} />} />
          <Route
            path="profile/:username"
            element={<Profile currentUser={state.username} />}
          />
          <Route
            path="register"
            element={
              <CheckRegister loggedIn={loggedIn()} username={state.username} />
            }
          />
          <Route
            path="start"
            element={
              <ReqUser user={state}>
                <Start />
              </ReqUser>
            }
          />
          <Route path="game/:id" element={<Game user={state} />} />
          <Route path="results/:id" element={<Results user={state} />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default Solitaire;
