/* Copyright G. Hemingway, @2023 - All rights reserved */
"use strict";

import PropTypes from "prop-types";
import React from "react";

export const Card = ({ card, top, left, onClick, targeted }) => {
  const source = card.up
    ? `/assets/solitaire/${card.value}_of_${card.suit}.jpg`
    : "/assets/solitaire/face_down.jpg";
  const style = { left: `${left}%`, top: `${top}%` };
  if (targeted) {
    style["boxShadow"] = "0 0 10px lightcoral";
    style["border"] = "solid 1px red";
  }
  const id = `${card.suit}:${card.value}`;
  return (
    <img
      id={id}
      onClick={onClick}
      style={style}
      src={source}
      className="h-auto w-full absolute rounded-lg"
    />
  );
};

Card.propTypes = {
  card: PropTypes.object.isRequired,
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  targeted: PropTypes.bool,
};

export const Pile = ({
  base,
  cards,
  spacing,
  horizontal,
  up,
  onClick,
  onTarget,
}) => {
  const clickWrapper = (e) => {
    e.stopPropagation();
    onClick(e);
  };
  const children = cards.map((card, i) => {
    const top = horizontal ? 0 : i * spacing;
    const left = horizontal ? i * spacing : 0;
    const targeted =
      onTarget &&
      onTarget.cards.find(
        (c) => c.suit === card.suit && c.value === card.value
      ) !== undefined;
    return (
      <Card
        key={i}
        card={card}
        up={up}
        top={top}
        left={left}
        onClick={clickWrapper}
        targeted={targeted}
      />
    );
  });
  return (
    <div
      id={base}
      onClick={clickWrapper}
      className="inline-block relative m-1 border-dashed border-2 border-gray-400 rounded p-1 w-[12%] fill-white"
    >
      <div className="mt-[140%]" />
      {children}
    </div>
  );
};

Pile.propTypes = {
  base: PropTypes.string.isRequired,
  cards: PropTypes.arrayOf(PropTypes.object),
  onClick: PropTypes.func,
  horizontal: PropTypes.bool,
  spacing: PropTypes.number,
  up: PropTypes.bool,
  onTarget: PropTypes.object,
};
Pile.defaultProps = {
  horizontal: false, // Layout horizontal?
  spacing: 8, // In percent,
  cards: [],
};
