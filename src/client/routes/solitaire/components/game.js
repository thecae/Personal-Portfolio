/* Copyright G. Hemingway, @2023 - All rights reserved */
"use strict";

import { faRotateRight, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { findCard, getMove } from "./game-helper.js";
import { Pile } from "./pile.js";
import { ModalNotify } from "./shared.js";

const GameBase = ({ children }) => (
  <div className="grid-row-2 grid-column-sb-main">{children}</div>
);

GameBase.propTypes = {
  children: PropTypes.node.isRequired,
};

const CardRowGap = ({ children }) => (
  <div className="flex-grow">{children}</div>
);

CardRowGap.propTypes = {
  children: PropTypes.node,
};

const CardRow = ({ children }) => (
  <div id="whitespace5" className="relative flex flex-row flex-nowrap justify-center items-start mb-8">
    {children}
  </div>
);

CardRow.propTypes = {
  children: PropTypes.node.isRequired,
};

const Game = () => {
  let navigate = useNavigate();
  const { id } = useParams();
  const currentState = useRef();
  let [state, setState] = useState({
    pile1: [],
    pile2: [],
    pile3: [],
    pile4: [],
    pile5: [],
    pile6: [],
    pile7: [],
    stack1: [],
    stack2: [],
    stack3: [],
    stack4: [],
    draw: [],
    discard: [],
  });
  let [notify, setNotify] = useState("");
  let [flash, setFlash] = useState(false);
  let [target, setTarget] = useState(undefined);

  const location = useLocation();
  const moveQuery = new URLSearchParams(location.search).get("move");

  let onClick = () => {}; // default state: do nothing
  let onWin = () => {}; // register as function so it's passed properly
  let autocomplete = () => {}; // register as function so it's passed properly
  let undo = () => {}; // register as function so it's passed properly
  let redo = () => {}; // register as function so it's passed properly

  // flash the screen
  const handleFlash = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 500);
  };

  // get initial game state
  useEffect(() => {
    const getGameState = async () => {
      const query = moveQuery ? `?move=${moveQuery}` : "";
      const response = await fetch(`/api/game/${id}${query}`);
      const data = await response.json();
      setState({
        pile1: data.state.pile1,
        pile2: data.state.pile2,
        pile3: data.state.pile3,
        pile4: data.state.pile4,
        pile5: data.state.pile5,
        pile6: data.state.pile6,
        pile7: data.state.pile7,
        stack1: data.state.stack1,
        stack2: data.state.stack2,
        stack3: data.state.stack3,
        stack4: data.state.stack4,
        draw: data.state.draw,
        discard: data.state.discard,
      });
    };
    getGameState();
  }, [id]);

  // update ref when state changes
  useEffect(() => {
    currentState.current = state;
  }, [state]);

  // if no move query, allow moves
  if (!moveQuery) {
    // check for global bindings: keydowns and clicks
    useEffect(() => {
      const keyDown = (ev) => {
        if (ev.key === "Escape") setTarget(undefined);
      };
      const mouseDown = (ev) => {
        if (
          ev.target === document.body ||
          ev.target.id.slice(0, 10) === "whitespace"
        )
          setTarget(undefined);
      };
      document.body.addEventListener("keydown", keyDown);
      document.body.addEventListener("mousedown", mouseDown);
      return () => {
        document.body.removeEventListener("keydown", keyDown);
        document.body.removeEventListener("mousedown", mouseDown);
      };
    }, []);

    // request a move from the database
    const requestMove = async (target) => {
      try {
        const res = await fetch(`/api/game/${id}`, {
          method: "PUT",
          body: JSON.stringify(target),
          headers: {
            "content-type": "application/json",
          },
        });
        const data = await res.json();
        if ("error" in data) {
          handleFlash();
        } else {
          setState(data.state);
          // check for win state
          if ("active" in data && !data.active) {
            if (data.won) setNotify("You won!");
            else setNotify("You lost!");
          }
        }
      } catch (err) {
        console.error(`error sending request: ${err}`);
      }
      setTarget(undefined);
    };

    onClick = (ev) => {
      // register card JSON
      let select = ev.target.id;
      let card = { suit: select.split(":")[0], value: select.split(":")[1] };

      // moving to a base
      if (!card.value) {
        if (state.draw.length === 0) {
          if (state.discard.length > 0) {
            requestMove({ src: "draw", dest: "discard" });
            return;
          } else return;
        }
        if (!target) return;
        target.dest = ev.target.id;
        requestMove(target);
        return;
      }

      // find card in stack, verify clickable
      let found = findCard(state, card);
      if (found.pile === "draw") {
        requestMove({ src: "draw", dest: "discard" });
        return;
      }

      // check if card is up
      if (!found?.card?.up) return;

      // enumerate the moving group
      let pickup = state[found.pile].slice(
        state[found.pile].indexOf(found.card)
      );

      // set the state if not
      if (!target) setTarget({ cards: pickup, src: found.pile });
      else {
        // ignore clicking on the same pile
        if (found.pile === target.src) return;

        // send the request
        target.dest = found.pile;
        requestMove(target);
      }
    };

    autocomplete = async () => {
      while (!notify && !flash) {
        const move = getMove(currentState.current);
        if (move) await requestMove(move);
        else break;

        // Pause for animation
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    };

    undo = async () => {
      const res = await fetch(`/api/game/${id}/undo`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
      });
      const data = await res.json();
      if ("error" in data) handleFlash();
      else setState(data.state);
    };

    redo = async () => {
      const res = await fetch(`/api/game/${id}/redo`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
      });
      const data = await res.json();
      if ("error" in data) handleFlash();
      else setState(data.state);
    };

    onWin = () => {
      navigate(`/solitaire/results/${id}`);
    };
  }

  return (
    <div
      id="whitespace4"
      className={`top-24 bottom-0 left-0 right-0 fixed inset-0${flash ? " flash-error" : ""}`}
    >
      {notify !== "" ? (
        <ModalNotify id="notification" msg={notify} onAccept={onWin} />
      ) : null}
      {!moveQuery && (
        <div className="justify-between flex mx-auto my-2 w-11/12">
          <div>
            <button onClick={undo}>
              <FontAwesomeIcon
                icon={faUndo}
                className="my-1 mx-2 undo-hover"
                style={{ fontSize: "24px" }}
              />
            </button>
            <button onClick={redo}>
              <FontAwesomeIcon
                icon={faRotateRight}
                className="my-1 mx-2 redo-hover"
                style={{ fontSize: "24px" }}
              />
            </button>
          </div>
          <button
            style={{ fontSize: "24px" }}
            onClick={autocomplete}
            className="self-center autocomplete hover:text-nightfall-function"
          >
            Autocomplete
          </button>
        </div>
      )}
      <GameBase id={"whitespace1"}>
        <CardRow id={"whitespace2"}>
          <Pile
            base={"stack1"}
            cards={state.stack1}
            spacing={0}
            onClick={onClick}
            onTarget={target}
          />
          <Pile
            base={"stack2"}
            cards={state.stack2}
            spacing={0}
            onClick={onClick}
            onTarget={target}
          />
          <Pile
            base={"stack3"}
            cards={state.stack3}
            spacing={0}
            onClick={onClick}
            onTarget={target}
          />
          <Pile
            base={"stack4"}
            cards={state.stack4}
            spacing={0}
            onClick={onClick}
            onTarget={target}
          />
          <CardRowGap />
          <Pile
            base={"draw"}
            cards={state.draw}
            spacing={0}
            onClick={onClick}
            onTarget={target}
          />
          <Pile
            base={"discard"}
            cards={state.discard}
            spacing={0}
            onClick={onClick}
            onTarget={target}
          />
        </CardRow>
        <CardRow id={"whitespace3"}>
          <Pile
            base={"pile1"}
            cards={state.pile1}
            onClick={onClick}
            onTarget={target}
          />
          <Pile
            base={"pile2"}
            cards={state.pile2}
            onClick={onClick}
            onTarget={target}
          />
          <Pile
            base={"pile3"}
            cards={state.pile3}
            onClick={onClick}
            onTarget={target}
          />
          <Pile
            base={"pile4"}
            cards={state.pile4}
            onClick={onClick}
            onTarget={target}
          />
          <Pile
            base={"pile5"}
            cards={state.pile5}
            onClick={onClick}
            onTarget={target}
          />
          <Pile
            base={"pile6"}
            cards={state.pile6}
            onClick={onClick}
            onTarget={target}
          />
          <Pile
            base={"pile7"}
            cards={state.pile7}
            onClick={onClick}
            onTarget={target}
          />
        </CardRow>
      </GameBase>
    </div>
  );
};

Game.propTypes = {};

export default Game;
