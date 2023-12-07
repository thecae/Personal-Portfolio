/* Copyright G. Hemingway, @2023 - All rights reserved */
"use strict";

import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { ErrorMessage } from "./shared.js";

const Move = ({ move, index, player, endTime }) => {
  let navigate = useNavigate();
  const duration = (new Date(endTime) - new Date(move.date)) / 1000;

  const onClick = () => {
    navigate(`/solitaire/game/${move.game}?move=${move.id}`);
  };

  return (
    <tr onClick={onClick} className="hover:bg-nightfall-highlight cursor-pointer text-center">
      <td className="border border-nightfall-highlight p-2">
        {move.id ? move.id : index + 1}
      </td>
      <td className="border border-nightfall-highlight p-2 ">{duration} seconds</td>
      <td className="border border-nightfall-highlight p-2">
        <Link
          to={`/solitaire/profile/${player}`}
          className="text-nightfall-string hover:font-bold"
        >
          {player}
        </Link>
      </td>
      <td className="border border-nightfall-highlight p-2">{move.move}</td>
    </tr>
  );
};

Move.propTypes = {
  move: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  player: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
};

const MovesList = ({ game }) => {
  let moveElements = game.moves.map((move, index) => {
    const endTime = game.moves[index + 1]
      ? game.moves[index + 1].date
      : game.end
      ? game.end
      : new Date().toISOString();
    return (
      <Move
        key={`${move}:${endTime}`}
        move={move}
        player={game.player}
        endTime={endTime}
        index={index}
      />
    );
  });
  return (
    <table className="w-full min-w-max border-collapse border border-gray-400 mt-4">
      <thead>
        <tr className="bg-nightfall-comment">
          <th className="border border-nightfall-highlight p-2">Id</th>
          <th className="border border-nightfall-highlight p-2">Duration</th>
          <th className="border border-nightfall-highlight p-2">Player</th>
          <th className="border border-nightfall-highlight p-">Move Details</th>
        </tr>
      </thead>
      <tbody>{moveElements}</tbody>
    </table>
  );
};

MovesList.propTypes = {
  game: PropTypes.object.isRequired,
};

const GameDetail = ({ start, end, moves, score, cards_remaining, active }) => {
  const duration = start
    ? ((end ? new Date(end) : Date.now()) - start) / 1000
    : "--";
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="font-bold text-right text-nightfall-function">
        <p>Duration:</p>
        <p>Number of Moves:</p>
        <p>Points:</p>
        <p>Cards Remaining:</p>
        <p>Able to Move:</p>
      </div>
      <div>
        <p>{duration} seconds</p>
        <p>{moves.length}</p>
        <p>{score}</p>
        <p>{cards_remaining}</p>
        <p>{active ? "Active" : "Complete"}</p>
      </div>
    </div>
  );
};

GameDetail.propTypes = {
  start: PropTypes.number.isRequired,
  end: PropTypes.string,
  moves: PropTypes.array.isRequired,
  score: PropTypes.number.isRequired,
  cards_remaining: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
};

const Results = () => {
  const { id } = useParams();
  // Initialize the state
  let [game, setGame] = useState({
    start: 0,
    score: 0,
    cards_remaining: 0,
    active: true,
    moves: [],
  });
  let [error, setError] = useState("");

  // Fetch data on load
  useEffect(() => {
    fetch(`/api/game/${id}?moves=true`)
      .then((res) => res.json())
      .then((data) => {
        setGame({
          start: data.start,
          end: data.end,
          player: data.player,
          score: data.score,
          cards_remaining: data.cards_remaining,
          active: data.active,
          moves: data.moveList,
        });
      })
      .catch((err) => setError(err.message));
  }, [id]);

  // ignore pre-render
  if (game.start === 0) return null;

  return (
    <div className="flex flex-col justify-center items-center w-11/12 mx-auto mb-4">
      <ErrorMessage msg={error} hide={true} />
      <div className="flex flex-row w-full justify-around mt-4">
        <h4 className="text-5xl font-bold text-nightfall-function mb-4 self-center">
          Game Detail
        </h4>
        <GameDetail {...game} />
      </div>
      <MovesList game={game} />
    </div>
  );
};

export default Results;
