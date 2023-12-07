/* Copyright G. Hemingway, 2023 - All rights reserved */
"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CardState = require("./card_state.cjs");

/***************** Move Model *******************/

/* Schema for overall solitaire game state */
let KlondikeGameState = new Schema(
  {
    pile1: { type: [CardState] },
    pile2: { type: [CardState] },
    pile3: { type: [CardState] },
    pile4: { type: [CardState] },
    pile5: { type: [CardState] },
    pile6: { type: [CardState] },
    pile7: { type: [CardState] },
    stack1: { type: [CardState] },
    stack2: { type: [CardState] },
    stack3: { type: [CardState] },
    stack4: { type: [CardState] },
    discard: { type: [CardState] },
    draw: { type: [CardState] },
  },
  { _id: false }
);

/* Schema for an individual move of Klondike */
let Move = new Schema({
  user: { type: Schema.ObjectId, ref: "User", required: true, index: true },
  game: { type: Schema.ObjectId, ref: "Game", required: true, index: true },
  cards: { type: [CardState] },
  src: { type: String },
  dst: { type: String },
  date: { type: Date },
  string: { type: String },
  state: { type: KlondikeGameState },
  num: { type: Number },
});

Move.pre("validate", function (next) {
  this.start = Date.now();
  next();
});

module.exports = mongoose.model("Move", Move);
