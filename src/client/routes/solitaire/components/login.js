/* Copyright G. Hemingway, @2023 - All rights reserved */
"use strict";

import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorMessage, FormBase } from "./shared.js";

const Login = (props) => {
  let navigate = useNavigate();
  let [state, setState] = useState({
    username: "",
    password: "",
  });
  let [error, setError] = useState("");

  const onChange = (ev) => {
    setError("");
    // Update from form and clear errors
    setState({
      ...state,
      [ev.target.name]: ev.target.value,
    });
  };
  const onSubmit = async (ev) => {
    ev.preventDefault();
    let res = await fetch("/api/session", {
      body: JSON.stringify({
        username: state.username,
        password: state.password,
      }),
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });
    const data = await res.json();
    if ("error" in data) {
      setError(`Error: ${data.error}`);
    } else {
      props.logIn(data.username);
      navigate(`/solitaire/profile/${data.username}`);
    }
  };
  const onGithubAuth = async () => {
    const res = await fetch("/api/auth", {
      method: "GET",
    });
    const data = await res.json();
    window.location.href = data.url;
  };

  useEffect(() => {
    document.getElementById("username").focus();
  }, []);

  return (
    <div className="grid grid-cols-1 place-items-center h-screen bg-nightfall-background">
      <div className="w-full max-w-lg">
        <ErrorMessage msg={error} />
        <FormBase>
          {["username", "password"].map((field) => (
            <div key={field} className="mb-4">
              <label
                className="block text-nightfall-comment text-sm font-bold mb-2"
                htmlFor={field}
              >
                {field.replace(/_/g, " ")}
              </label>
              <input
                id={field}
                name={field}
                type={field === "password" ? "password" : "text"}
                placeholder={field.replace(/_/g, " ")}
                value={state[field]}
                onChange={onChange}
                className="bg-nightfall-highlight shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          ))}
          <button
            onClick={onGithubAuth}
            className="bg-gray-900 hover:bg-black hover:shadow-lg font-bold no-underline py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
          >
            <div className="flex justify-center">
              <img
                src="/assets/solitaire/github-icon.png"
                className="w-6 h-6 inline-block mr-2"
                alt="github icon"
              />
              <div className="flex-grow" />
              <p>Login with GitHub</p>
              <div className="flex-grow" />
            </div>
          </button>
          <button
            id="submitBtn"
            onClick={onSubmit}
            className="bg-nightfall-highlight hover:bg-nightfall-comment font-bold no-underline py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </FormBase>
      </div>
    </div>
  );
};

Login.propTypes = {
  logIn: PropTypes.func.isRequired,
};

export default Login;
