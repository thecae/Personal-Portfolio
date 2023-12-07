/* Copyright G. Hemingway, @2023 - All rights reserved */
"use strict";

import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GameList } from "./game-list.js";
import { GravHash } from "./header.js";
import {
  Edit,
  EditStr,
  Edits,
  ErrorMessage,
  InfoData,
  InfoLabels,
  ShortP,
} from "./shared.js";

const OptionalEdit = ({ show, onSubmit, toggleFunc, editFunc, text }) => {
  return show ? (
    <EditStr
      onSubmit={onSubmit}
      onChange={(e) => editFunc(e.target.value)}
      onCancel={() => toggleFunc(false)}
      name={`New ${text}`}
    />
  ) : (
    <Edit onClick={() => toggleFunc(true)}>Edit</Edit>
  );
};

OptionalEdit.propTypes = {
  show: PropTypes.bool,
  onSubmit: PropTypes.func,
  toggleFunc: PropTypes.func,
  editFunc: PropTypes.func,
  text: PropTypes.string,
};

const ProfileBlock = (props) => {
  const { firstSubmit, lastSubmit, citySubmit, emailSubmit } = props;

  const [firstToggle, setFirstToggle] = useState(false);
  const [newFirst, setNewFirst] = useState("");
  const [lastToggle, setLastToggle] = useState(false);
  const [newLast, setNewLast] = useState("");
  const [cityToggle, setCityToggle] = useState(false);
  const [newCity, setNewCity] = useState("");
  const [emailToggle, setEmailToggle] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const onFirstSubmit = async (e) => {
    e.preventDefault();
    setFirstToggle(false);
    await firstSubmit(newFirst);
  };
  const onLastSubmit = async (e) => {
    e.preventDefault();
    setLastToggle(false);
    await lastSubmit(newLast);
  };
  const onCitySubmit = async (e) => {
    e.preventDefault();
    setCityToggle(false);
    await citySubmit(newCity);
  };
  const onEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailToggle(false);
    await emailSubmit(newEmail);
  };

  return (
    <div className="flex flex-col md:flex-row p-4 bg-nightfall-highlight shadow rounded justify-between">
      <img
        src={GravHash(props.primary_email, 200)}
        className="w-48 h-48 rounded-full self-center md:mb-0 md:mr-4"
        alt="Profile"
      />
      <div className="flex-grow" />
      <div className="grid grid-cols-3 gap-4 justify-between">
        <InfoLabels>
          <ShortP>Username:</ShortP>
          <ShortP>First Name:</ShortP>
          <ShortP>Last Name:</ShortP>
          <ShortP>City:</ShortP>
          <ShortP>Email Address:</ShortP>
        </InfoLabels>
        <InfoData>
          <ShortP>{props.username}</ShortP>
          <ShortP>{props.first_name}</ShortP>
          <ShortP>{props.last_name}</ShortP>
          <ShortP>{props.city}</ShortP>
          <ShortP>{props.primary_email}</ShortP>
        </InfoData>
        <Edits>
          <div style={{ flexGrow: 0.6 }} />
          <OptionalEdit
            show={firstToggle}
            onSubmit={onFirstSubmit}
            toggleFunc={setFirstToggle}
            editFunc={setNewFirst}
            text={"First Name"}
          />
          <OptionalEdit
            show={lastToggle}
            onSubmit={onLastSubmit}
            toggleFunc={setLastToggle}
            editFunc={setNewLast}
            text={"Last Name"}
          />
          <OptionalEdit
            show={cityToggle}
            onSubmit={onCitySubmit}
            toggleFunc={setCityToggle}
            editFunc={setNewCity}
            text={"City"}
          />
          <OptionalEdit
            show={emailToggle}
            onSubmit={onEmailSubmit}
            toggleFunc={setEmailToggle}
            editFunc={setNewEmail}
            text={"Email"}
          />
        </Edits>
      </div>
      <div className="flex-grow" />
    </div>
  );
};

ProfileBlock.propTypes = {
  username: PropTypes.string,
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  primary_email: PropTypes.string,
  city: PropTypes.string,
  firstSubmit: PropTypes.func,
  lastSubmit: PropTypes.func,
  citySubmit: PropTypes.func,
  emailSubmit: PropTypes.func,
};

const Profile = (props) => {
  const { username } = useParams();
  let [state, setState] = useState({
    username: "",
    first_name: "",
    last_name: "",
    primary_email: "",
    city: "",
    games: [],
    error: "",
  });
  let [loading, setLoading] = useState(true);

  const fetchUser = async (username) => {
    const res = await fetch(`/api/user/${username}`);
    const data = await res.json();
    if (data.error) setError(data.error);
    else setState(data);
  };

  useEffect(() => {
    const getUser = async () => {
      await fetchUser(username);
      setLoading(false);
    };
    getUser();
  }, [username]);

  const onFirstSubmit = async (newFirst) => {
    // send request to server
    const res = await fetch(`/api/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, first_name: newFirst }),
    });
    const data = await res.json();
    if (data.error) setError(data.error);
    else setState((prevState) => ({ ...prevState, first_name: newFirst }));
  };
  const onLastSubmit = async (newLast) => {
    // send request to server
    const res = await fetch(`/api/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, last_name: newLast }),
    });
    const data = await res.json();
    if (data.error) setError(data.error);
    else setState({ ...state, last_name: newLast });
  };
  const onCitySubmit = async (newCity) => {
    // send request to server
    const res = await fetch(`/api/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, city: newCity }),
    });
    const data = await res.json();
    if (data.error) setError(data.error);
    else setState({ ...state, city: newCity });
  };
  const onEmailSubmit = async (newEmail) => {
    // send request to server
    const res = await fetch(`/api/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, primary_email: newEmail }),
    });
    const data = await res.json();
    if (data.error) setError(data.error);
    else setState({ ...state, primary_email: newEmail });
  };

  // ignore the pre-render
  if (loading) return <></>;

  // Is the logged-in user viewing their own profile
  const isUser = state.username === props.currentUser;
  return (
    <div className="flex flex-col justify-center mx-auto w-11/12 my-4">
      <ErrorMessage msg={state.error} hide={true} />
      <ProfileBlock
        {...state}
        firstSubmit={onFirstSubmit}
        lastSubmit={onLastSubmit}
        citySubmit={onCitySubmit}
        emailSubmit={onEmailSubmit}
      />
      <GameList toCreateGame={isUser} games={state.games} />
    </div>
  );
};

Profile.propTypes = {
  gridPlacement: PropTypes.string,
  user: PropTypes.string,
  currentUser: PropTypes.string,
};

export default Profile;
