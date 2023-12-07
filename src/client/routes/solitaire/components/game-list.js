/* Copyright G. Hemingway, @2023 - All rights reserved */
"use strict";

import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const Game = ({ game }) => {
  const date = new Date(game.start);
  const url = `/solitaire/${game.active ? "game" : "results"}/${game.id}`;
  return (
    <tr>
      <td>
        <Link to={url} className="hover:underline">{game.active ? "Active" : "Complete"}</Link>
      </td>
      <td>{date.toLocaleString()}</td>
      <td>{game.moves}</td>
      <td>{game.score}</td>
      <td>{game.game}</td>
    </tr>
  );
};

Game.propTypes = {
  game: PropTypes.object.isRequired,
};

const GameHeader = ({ count, toCreateGame }) => {
  return (
    <div className="flex justify-between items-center m-4">
      <h4 className="m-0 flex-grow text-lg font-semibold text-nightfall-string">
        Games ({count}
        ):
      </h4>
      {toCreateGame ? (
        <Link
          id="startLink"
          className="text-nightfall-string hover:font-bold"
          to="/solitaire/start"
        >
          Start new game
        </Link>
      ) : null}
    </div>
  );
};

GameHeader.propTypes = {
  count: PropTypes.number.isRequired,
  toCreateGame: PropTypes.bool.isRequired,
};

export const GameList = ({ games, toCreateGame }) => {
  // Build array of games
  let gameList = games.map((game, index) => <Game key={index} game={game} />);
  return (
    <Fragment>
      <GameHeader count={games.length} toCreateGame={toCreateGame} />
      <table className="min-w-full text-center border-collapse">
        <thead>
          <tr className="text-nightfall-function">
            <th>Status</th>
            <th>Start Date</th>
            <th># of Moves</th>
            <th>Score</th>
            <th>Game Type</th>
          </tr>
        </thead>
        <tbody>{gameList}</tbody>
      </table>
    </Fragment>
  );
};

GameList.propTypes = {
  games: PropTypes.array.isRequired,
  toCreateGame: PropTypes.bool.isRequired,
};
