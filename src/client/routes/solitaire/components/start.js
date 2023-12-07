/* Copyright G. Hemingway, @2023 - All rights reserved */
"use strict";

import PropTypes from "prop-types";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorMessage } from "./shared.js";

const gameNames = [
  "klondike",
  "pyramid",
  "canfield",
  "golf",
  "yukon",
  "hearts",
];

const GameTypes = ({ game, onChange }) => {
  const games = gameNames.map((g) => (
    <GameChoice key={g} game={g} selected={game === g} onChange={onChange} />
  ));
  return <div className="flex flex-col mr-4">{games}</div>;
};

GameTypes.propTypes = {
  game: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const GameChoice = ({ game, selected, onChange }) => {
  return (
    <label>
      <input
        type="radio"
        name="game"
        value={game}
        checked={selected}
        onChange={onChange}
      />
      {game}
    </label>
  );
};

GameChoice.propTypes = {
  game: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

const Start = ({ history }) => {
  let navigate = useNavigate();
  let [state, setState] = useState({
    game: "klondike",
    draw: "Draw 1",
    color: "Red",
  });
  let [error, setError] = useState("");

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const response = await fetch("/api/game", {
      body: JSON.stringify({
        game: state.game,
        draw: state.draw,
        color: state.color,
      }),
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });
    const data = await response.json();
    if ("error" in data) {
      setError(`Error: ${data.error}`);
    } else {
      navigate(`/solitaire/game/${data.id}`);
    }
  };

  const onChange = (ev) =>
    setState({
      ...state,
      [ev.target.name]: ev.target.value,
    });

  return (
    <div className="p-4">
      <ErrorMessage msg={error} />
      <h4 className="w-3/4 mx-auto">Create New Game</h4>
      <form className="flex flex-col md:flex-row md:justify-between w-3/4 mx-auto">
        <GameTypes game={state.game} onChange={onChange} />
        <div className="flex flex-col mb-4 md:mb-0 justify-end items-end">
          <div className="mb-4">
            <label htmlFor="draw" className="mr-2">
              Draw:
            </label>
            <select
              id="draw"
              name="draw"
              disabled={"hearts" === state.game}
              onChange={onChange}
              className="p-2 border border-nightfall-highlight rounded bg-nightfall-background"
            >
              <option>Draw 1</option>
              <option>Draw 3</option>
            </select>
          </div>
          <div>
            <label htmlFor="color" className="mr-2">
              Card Color:
            </label>
            <select
              id="color"
              name="color"
              onChange={onChange}
              className="p-2 border border-nightfall-highlight rounded bg-nightfall-background"
            >
              <option>Red</option>
              <option>Green</option>
              <option>Blue</option>
              <option>Magical</option>
            </select>
          </div>
        </div>
      </form>
      <div className="w-3/4 mx-auto">
        <button
          id="startBtn"
          type="submit"
          onClick={onSubmit}
          className="bg-nightfall-highlight hover:bg-nightfall-comment text-white font-bold py-2 px-4 rounded mt-4 md:mt-0"
        >
          Start
        </button>
      </div>
    </div>
  );
};

Start.propTypes = {
  history: PropTypes.object,
};

export default Start;
