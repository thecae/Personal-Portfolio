'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CardState = require("./card_state.cjs");

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

let MoveStack = new Schema({
    game: { type: Schema.ObjectId, ref: 'Game', required: true, index: true },
    initial: { type: KlondikeGameState, required: true },
    past: [{type: Schema.ObjectId, ref: "Move"}],
    future: [{type: Schema.ObjectId, ref: "Move"}],
});

module.exports = mongoose.model('MoveStack', MoveStack);