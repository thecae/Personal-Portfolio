/* Copyright G. Hemingway, 2023 - All rights reserved */
"use strict";

const Joi = require("joi");
const {
  initialState,
  shuffleCards,
  filterGameForProfile,
  filterMoveForResults,
} = require("./solitaire.cjs");

// equate two cards
const same = (one, two) => one.suit === two.suit && one.value === two.value;

// validate the moving of cards
let validateMove = async (state, move) => {
  const hierarchy = [
    "ace",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "jack",
    "queen",
    "king",
  ];

  // move a king onto an empty PILE
  if (
    move.dest.slice(0, 4) === "pile" &&
    state[move.dest].length === 0 &&
    move.cards[0].value === "king"
  )
    return true;

  // move an ace onto an empty STACK
  if (
    move.dest.slice(0, 5) === "stack" &&
    state[move.dest].length === 0 &&
    move.cards[0].value === "ace"
  )
    return true;

  // move a card onto a STACK
  if (
    move.dest.slice(0, 5) === "stack" &&
    move.cards.length === 1 &&
    state[move.dest].length > 0 &&
    move.cards[0].suit === state[move.dest].slice(-1)[0].suit &&
    move.cards[0].value ===
      hierarchy[hierarchy.indexOf(state[move.dest].slice(-1)[0].value) + 1]
  )
    return true;

  const opposingSuits = (suit1, suit2) => {
    const reds = ["hearts", "diamonds"];
    const blacks = ["clubs", "spades"];
    return (
      (reds.includes(suit1) && blacks.includes(suit2)) ||
      (reds.includes(suit2) && blacks.includes(suit1))
    );
  };

  // move from STACK/PILE to a non-empty pile
  return (
    state[move.dest].length > 0 &&
    move.cards[0].value ===
      hierarchy[hierarchy.indexOf(state[move.dest].slice(-1)[0].value) - 1] &&
    opposingSuits(move.cards[0].suit, state[move.dest].slice(-1)[0].suit)
  );
};

let gameWon = (state) => {
  return (
    state.stack1.length === 13 &&
    state.stack2.length === 13 &&
    state.stack3.length === 13 &&
    state.stack4.length === 13
  );
};

let gameContinue = (state) => {
  // gets last card of a pile/stack
  const last = (pile) => {
    try {
      return pile.slice(-1)[0];
    } catch (err) {
      return null;
    }
  };
  const top = (pile) => {
    const flipped = pile.find((card) => card.up);
    if (flipped) return flipped;
  };
  // finds usable cards for piles (-1) and stacks (+1)
  const usableCard = (card, offset) => {
    let suit;
    const hierarchy = [
      "ace",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "jack",
      "queen",
      "king",
    ];

    if (!card) return [];
    // get opposite suit
    const reds = ["diamonds", "hearts"];
    const blacks = ["spades", "clubs"];
    if (reds.indexOf(card.suit) !== -1) suit = blacks;
    else suit = reds;

    // get next num
    if (offset > 0) {
      return [
        {
          suit: card.suit,
          value: hierarchy[hierarchy.indexOf(card.value) + offset],
        },
      ];
    } else {
      if (card.value == "ace") return [];

      // make all combinations
      return suit.map((s) => ({
        suit: s,
        value: hierarchy[hierarchy.indexOf(card.value) + offset],
      }));
    }
  };
  const intersect = (list1, list2) => {
    return list1.filter((p) => list2.some((s) => p && s && same(p, s)));
  };

  // get our list of usable cards on the piles
  const lastsPile = [];
  Object.keys(state.toObject()).forEach((k) => {
    if (k.startsWith("pile")) lastsPile.push(last(state[k]));
  });
  let usablePile = lastsPile.map((l) => usableCard(l, -1)).flat();

  // get list of usable cards on the stack
  const lastsStack = [];
  Object.keys(state.toObject()).forEach((k) => {
    if (k.startsWith("stack")) lastsStack.push(last(state[k]));
  });
  let usableStack = lastsStack.map((l) => usableCard(l, 1)).flat();

  // find the intersection of available and usable cards
  const available = state.draw.concat(state.discard);
  const intDeckPiles = intersect(usablePile.concat(usableStack), available);

  // check if there are movable cards from pile to stack
  const intPileStack = intersect(lastsPile, usableStack);

  // check if there are movable cards between piles
  const topPiles = [];
  Object.keys(state.toObject()).forEach((k) => {
    if (k.startsWith("pile")) topPiles.push(top(state[k]));
  });
  const intPilePile = intersect(topPiles, usablePile);

  // edge case: aces in deck = playable game
  if (lastsPile.concat(available).find((c) => c && c.value === "ace"))
    return true;

  // edge case: king in deck/pile + empty pile = playable game
  let hasEmpty = false;
  Object.keys(state.toObject()).forEach((k) => {
    if (k.startsWith("pile") && state[k].length === 0) hasEmpty = true;
  });
  // Check for a playable king (not on a solo pile)
  let playableKing = topPiles.concat(available).find((c) => {
    if (c && c.value === "king") {
      // king in the deck/discard is playable
      if (available.find((a) => same(a, c))) return true;
      // Check if the king is in a pile and not the only card
      return Object.keys(state).some((p) => {
        if (p.startsWith("pile"))
          return state[p].findIndex((c) => same(c, king)) > 1;
      });
    }
    return false;
  });
  if (hasEmpty && playableKing) return true;

  return (
    intPilePile.length > 0 || intPileStack.length > 0 || intDeckPiles.length > 0
  );
};

module.exports = (app) => {
  /**
   * Create a new game
   *
   * @param {req.body.game} Type of game to be played
   * @param {req.body.color} Color of cards
   * @param {req.body.draw} Number of cards to draw
   * @return {201 with { id: ID of new game }}
   */
  app.post("/api/game", async (req, res) => {
    if (!req.session.user)
      return res.status(200).send({ error: "unauthorized" });

    // Schema for user info validation
    const schema = Joi.object({
      game: Joi.string().lowercase().required(),
      color: Joi.string().lowercase().required(),
      draw: Joi.any(),
    });
    // Validate user input
    try {
      const data = await schema.validateAsync(req.body, { stripUnknown: true });
      // Set up the new game
      let newGame = {
        owner: req.session.user._id,
        active: true,
        cards_remaining: 52,
        color: data.color,
        game: data.game,
        score: 0,
        start: Date.now(),
        winner: "",
        state: [],
      };
      switch (data.draw) {
        case "Draw 1":
          newGame.drawCount = 1;
          break;
        case "Draw 3":
          newGame.drawCount = 3;
          break;
        default:
          newGame.drawCount = 1;
      }
      console.log(newGame);
      // Generate a new initial game state
      newGame.state = initialState();
      let game = new app.models.Game(newGame);
      try {
        await game.save();
        const query = { $push: { games: game._id } };
        // Save game to user's document too
        await app.models.User.findByIdAndUpdate(req.session.user._id, query);
        // add instance to move stack
        let moveStack = new app.models.MoveStack({
          game: game._id,
          initial: game.state,
        });
        await moveStack.save();
        return res.status(201).send({ id: game._id });
      } catch (err) {
        console.error(`Game.create save failure: ${err}`);
        return res.status(200).send({ error: "failure creating game" });
        // TODO: Much more error management needs to happen here
      }
    } catch (err) {
      console.error(
        `Game.create validation failure: ${err.details[0].message}`
      );
      return res.status(200).send({ error: err.details[0].message });
    }
  });

  /**
   * Fetch game information
   *
   * @param (req.params.id} Id of game to fetch
   * @return {200} Game information
   */
  app.get("/api/game/:id", async (req, res) => {
    // get move from query string
    const moveQuery = req.query.move;
    // get the move number from the list
    if (moveQuery) {
      try {
        let move = await app.models.Move.findOne({
          game: req.params.id,
          num: moveQuery,
        });
        if (!move) return res.status(200).send({ error: "unknown move" });
        return res.status(200).send({ state: move.state });
      } catch (err) {
        console.error(`Game.get move failure: ${err}`);
        return res.status(200).send({ error: `unknown move: ${moveQuery}` });
      }
    }

    try {
      // get the game
      let game = await app.models.Game.findById(req.params.id);
      if (!game)
        return res
          .status(200)
          .send({ error: `unknown game: ${req.params.id}` });

      // filter game stats
      const state = game.state.toJSON();
      let results = filterGameForProfile(game);
      results.start = Date.parse(results.start);
      results.cards_remaining =
        52 -
        (state.stack1.length +
          state.stack2.length +
          state.stack3.length +
          state.stack4.length);
      // get the player
      const user = await app.models.User.findById(results.player);
      results.player = user.username;

      // Do we need to grab the moves
      if (req.query.moves === "true") {
        const moves = await app.models.Move.find({ game: req.params.id });
        const filteredMoves = moves.map((move) => filterMoveForResults(move));
        return res.status(200).send({ ...results, moveList: filteredMoves });
      }
      return res.status(200).send({ ...results });
    } catch (err) {
      console.error(`Game.get failure: ${err}`);
      return res.status(200).send({ error: `unknown game: ${req.params.id}` });
    }
  });

  /**
   * Make a move on the game
   *
   * @param {req.params.id} Game ID
   * @param {req.query.move} Move to perform
   * @return {200} Move Performed
   * @return {200} error: Unauthorized
   */
  app.put("/api/game/:id", async (req, res) => {
    // validate user and game
    if (!req.session.user)
      return res.status(200).send({ error: "unauthorized" });
    let game;
    try {
      // find the game, verify we own the game
      game = await app.models.Game.findById(req.params.id);
      if (!game || !game?.owner?.equals(req.session.user._id))
        return res.status(200).send({ error: "unauthorized" });
    } catch (err) {
      console.error(`Game/user get failure: ${err}`);
      return res.status(200).send({ error: `unknown game: ${req.params.id}` });
    }

    // check if game is active
    if (!game.active) return res.status(200).send({ error: "unauthorized" });

    // shuffle a deck of cards
    const shuffle = (deck) => {
      let i = deck.length,
        random;
      while (i > 0) {
        random = Math.floor(Math.random() * i);
        i--;
        [deck[i], deck[random]] = [deck[random], deck[i]];
      }
      return deck;
    };

    // check if move is a draw
    if (req.body.src === "draw") {
      if (game.state.draw.length === 0) {
        // if deck is empty, reshuffle the cards
        let reset = game.state.discard.splice(0, game.state.discard.length);
        reset = shuffle(reset);
        reset.forEach((card) => (card.up = false));
        game.state.draw.push(...reset);
      } else {
        let draw = game.state.draw.splice(
          game.state.draw.length - game.drawCount
        );
        draw.slice(-1)[0].up = true;
        game.state.discard.push(...draw);
      }
    } else {
      let valid = await validateMove(game.state, req.body);
      if (!valid) return res.status(200).send({ error: "invalid move" });

      // move is valid, perform the move
      game.state[req.body.dest].push(...req.body.cards);
      game.state[req.body.src].splice(
        game.state[req.body.src].length - req.body.cards.length
      );
      if (game.state[req.body.src].length > 0)
        game.state[req.body.src].slice(-1)[0].up = true;
    }

    // save the move
    try {
      game.moves += 1;
      await game.save();

      // name each move
      let string;
      if (req.body.src === "draw") string = "draw card";
      else {
        const name = (card) => `${card.value} of ${card.suit}`;
        // get source name
        const src = req.body.cards.slice(-1)[0];
        // get destination name
        let dest;
        if (game.state[req.body.dest].length > 1)
          dest = name(game.state[req.body.dest].slice(-2)[0]);
        else dest = req.body.dest;
        string = `${name(src)} to ${dest}`;
      }
      // add to moves table
      const mvJSON = {
        user: req.session.user._id,
        game: game._id,
        cards: req.body.cards,
        src: req.body.src,
        dst: req.body.dest,
        date: Date.now(),
        string: string,
        state: game.state,
        num: game.moves,
      };
      let mv = new app.models.Move(mvJSON);
      await mv.save();

      // add to move stack
      let moveStack = await app.models.MoveStack.findOne({ game: game._id });
      if (!moveStack) return res.status(200).send({ error: "unknown game" });
      moveStack.past.push(mv._id);

      // clear future moves
      for (let i = moveStack.future.length - 1; i >= 0; i--) {
        await app.models.Move.deleteOne({
          _id: moveStack.future[i],
        });
      }
      moveStack.future = [];
      await moveStack.save();

      // check for a winning game
      if (gameWon(game.state)) {
        game.active = false;
        game.won = true;
        game.end = Date.now();
        await game.save();
      } else if (!gameContinue(game.state)) {
        game.active = false;
        game.won = false;
        game.end = Date.now();
        await game.save();
      }

      return res
        .status(200)
        .send({ state: game.state, active: game.active, won: game.won });
    } catch (err) {
      console.error(`error saving game: ${err}`);
      return res.status(500).send({ error: "error saving game" });
    }
  });

  /**
   * Undo and redo moves
   *
   * @param {req.params.id} Game ID
   * @param {req.params.task} Undo or redo
   */
  app.put("/api/game/:id/:task", async (req, res) => {
    // validate user and game
    if (!req.session.user)
      return res.status(200).send({ error: "unauthorized" });
    let game;
    try {
      // find the game, verify we own the game
      game = await app.models.Game.findById(req.params.id);
      if (!game || !game?.owner?.equals(req.session.user._id))
        return res.status(200).send({ error: "unauthorized" });
    } catch (err) {
      console.error(`Game/user get failure: ${err}`);
      return res.status(200).send({ error: `unknown game: ${req.params.id}` });
    }

    // check if game is active
    if (!game.active) return res.status(200).send({ error: "unauthorized" });

    // fetch the move stacks
    let moveStack;
    try {
      moveStack = await app.models.MoveStack.findOne({ game: req.params.id });
      if (!moveStack)
        return res.status(200).send({ error: "unknown move stack" });
    } catch (err) {
      console.error(`MoveStack.get failure: ${err}`);
      return res.status(200).send({ error: "unknown move stack" });
    }

    if (req.params.task === "undo") {
      if (moveStack.past.length === 0)
        return res.status(200).send({ state: moveStack.initial });

      // move the move to the future
      const move = moveStack.past.pop();
      moveStack.future.push(move);
      await moveStack.save();

      // update the game's state
      if (moveStack.past.length === 0) {
        game.state = moveStack.initial;
      } else {
        const mv = await app.models.Move.findById(moveStack.past.slice(-1)[0]);
        game.state = mv.state;
      }

      game.moves -= 1;
      await game.save();
      return res.status(200).send({ state: game.state });
    } else if (req.params.task === "redo") {
      if (moveStack.future.length === 0)
        return res.status(200).send({ error: "no moves to redo!" });

      // move the move to the past
      const move = moveStack.future.pop();
      moveStack.past.push(move);
      await moveStack.save();

      // get the move
      const mv = await app.models.Move.findById(move);
      game.state = mv.state;
      game.moves += 1;
      await game.save();

      return res.status(200).send({ state: game.state });
    } else return res.status(200).send({ error: "unknown task" });
  });

  // Provide end-point to request shuffled deck of cards and initial state - for testing
  app.get("/api/cards/shuffle", (req, res) => {
    res.send(shuffleCards(false));
  });
  app.get("/api/cards/initial", (req, res) => {
    res.send(initialState());
  });
};
