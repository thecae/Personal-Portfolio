"use strict";

import React from "react";
import PropTypes from "prop-types";

const VelocitySlider = ({ currentVelocity, onVelocityChange }) => {
  let c;
  if (currentVelocity === 1) c = "c";
  else if (currentVelocity === 0) c = "0";
  else c = `${currentVelocity}c`;
  return (
    <div className="absolute top-16 right-5 text-center">
      <div className="italic text-nightfall-function">Velocity Control</div>
      <div className="flex items-center justify-between">
        <span className="text-nightfall-string">0</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          defaultValue={0}
          onChange={(e) => onVelocityChange(parseFloat(e.target.value))}
          className="slider-thumb slider-track"
        />
        <span className="text-nightfall-string">c</span>
      </div>
      <div className="text-nightfall-keyword">Velocity: {c}</div>
    </div>
  );
};

VelocitySlider.propTypes = {
  currentVelocity: PropTypes.number.isRequired,
  onVelocityChange: PropTypes.func.isRequired,
};

export default VelocitySlider;
