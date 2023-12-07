/* Copyright G. Hemingway, @2023 - All rights reserved */
"use strict";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validPassword, validUsername } from "../../../../shared/index.js";
import { ErrorMessage, FormBase, ModalNotify } from "./shared.js";

const Register = () => {
  let navigate = useNavigate();
  let [state, setState] = useState({
    username: "",
    first_name: "",
    last_name: "",
    city: "",
    primary_email: "",
    password: "",
  });
  let [error, setError] = useState("");
  let [notify, setNotify] = useState("");

  useEffect(() => {
    document.getElementById("username").focus();
  }, []);

  const onChange = (ev) => {
    setError("");
    // Update from form and clear errors
    setState({
      ...state,
      [ev.target.name]: ev.target.value,
    });
    // Make sure the username is valid
    if (ev.target.name === "username") {
      let usernameInvalid = validUsername(ev.target.value);
      if (usernameInvalid) setError(`Error: ${usernameInvalid.error}`);
    }
    // Make sure password is valid
    else if (ev.target.name === "password") {
      let pwdInvalid = validPassword(ev.target.value);
      if (pwdInvalid) setError(`Error: ${pwdInvalid.error}`);
    }
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    // Only proceed if there are no errors
    if (error !== "") return;
    const res = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(state),
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });
    const data = await res.json();
    if ("error" in data) {
      setError(data.error);
    } else {
      // Notify users
      setNotify(`${state.username} registered.  You will now need to log in.`);
    }
  };

  const onGithubAuth = async () => {
    const res = await fetch("/api/auth", {
      method: "GET",
    });
    const data = await res.json();
    window.location.href = data.url;
  };

  const onAcceptRegister = () => {
    navigate("/solitaire/login");
  };

  return (
    <div className="grid grid-cols-1 place-items-center h-screen bg-nightfall-background">
      <div className="w-full max-w-lg">
        {notify !== "" ? (
          <ModalNotify
            id="notification"
            msg={notify}
            onAccept={onAcceptRegister}
          />
        ) : null}
        <ErrorMessage msg={error} />
        <FormBase>
          {[
            "username",
            "first_name",
            "last_name",
            "city",
            "primary_email",
            "password",
          ].map((field) => (
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
                className="bg-nightfall-highlight shadow appearance-none border border-nightfall-comment rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          ))}
          <button
            onClick={onGithubAuth}
            className="bg-gray-900 hover:bg-black hover:shadow-lg font-bold no-underline py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
          >
            <div className="flex justify-between">
              <img
                src="/assets/solitaire/github-icon.png"
                className="w-6 h-6 inline-block mr-2"
                alt="github icon"
              />
              <p>Register with GitHub</p>
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

Register.propTypes = {};

export default Register;
