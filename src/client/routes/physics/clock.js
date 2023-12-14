import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const refresh = 100;

const Clock = ({ scale }) => {
  const [rot, setRot] = useState(0);

  useEffect(() => {
    const update = () => setRot((p) => (p + (6 / refresh) * scale) % 360);
    const int = setInterval(update, 1000 / refresh);
    return () => clearInterval(int);
  }, [scale]);

  return (
    <div className="absolute bottom-5 right-5">
      <div className="relative w-40 h-40 p-3 border-[7px] border-solid border-nightfall-background rounded-full clock-shadow bg-nightfall-background">
        <div className="relative bg-nightfall-background overflow-hidden w-full h-full rounded-full">
          <div className="absolute h-full z-0 left-1/2 bg-nightfall-keyword w-1 clock-outface"></div>
          <div className="absolute h-full z-0 left-1/2 bg-nightfall-comment w-1 clock-tick1"></div>
          <div className="absolute h-full z-0 left-1/2 bg-nightfall-comment w-1 clock-tick2"></div>
          <div className="absolute h-full z-0 left-1/2 bg-nightfall-comment w-1 clock-tick3"></div>
          <div className="absolute h-full z-0 left-1/2 bg-nightfall-comment w-1 clock-tick4"></div>
          <div className="absolute h-full z-0 left-1/2 bg-nightfall-keyword w-1 clock-outfa"></div>
          <div className="absolute top-[10%] left-[10%] bg-nightfall-background w-4/5 h-4/5 rounded-full z-1 before:absolute before:top-[45%] before:left-[45%] before:w-3 before:h-3 before:rounded-full before:z-10 before:bg-nightfall-highlight"></div>
          <div
            className="absolute bottom-1/2 left-1/2 transform h-2/5 w-1 bg-nightfall-variable rounded-md z-[3]"
            style={{
              transform: `rotate(${rot}deg)`,
              transformOrigin: "bottom",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

Clock.propTypes = {
  scale: PropTypes.number.isRequired,
};

export default Clock;
