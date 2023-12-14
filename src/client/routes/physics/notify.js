import React from "react";
import PropTypes from "prop-types";

const Notify = ({ open, onClose }) =>
  open && (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-nightfall-background bg-opacity-75 z-50">
      <div className="bg-nightfall-background border-4 border-solid border-nightfall-background clock-shadow rounded-xl p-4 max-w-3xl w-full m-4 flex flex-col shadow-xl">
        <h2 className="text-center font-bold text-3xl mb-4">
          Welcome to the Relativity Simulator!
        </h2>
        <h4 className="text-center italic">Here's how to use the simulator:</h4>
        <ol className="list-decimal text-left font-extralight mt-4 ml-8">
          <li className="">
            Use the mouse to move the camera around the simulation.
          </li>
          <li className="mt-2">
            Use the scroll wheel to zoom in and out of the simulation.
          </li>
          <li className="mt-2">
            Hold the{" "}
            <span className="border border-solid border-nightfall-background shadow-inner shadow-nightfall-highlight rounded-xl px-2 py-1 font-semibold">
              Shift
            </span>{" "}
            key and drag the mouse to rotate the camera around the simulation.
          </li>
          <li className="mt-2">
            Use the velocity slider at the top right of the screen to change the
            velocity of the reference frame.
          </li>
        </ol>
        <p className="mt-4">
          The goal of this simulation is to understand the effects of
          relativistic speeds, including time dilation and length contraction.
        </p>
        <p className="text-center italic mt-4 text-sm">
          Hope you enjoy! C.E. & J.S.
        </p>
        {onClose ? (
          <button
            onClick={onClose}
            className="bg-nightfall-highlight hover:bg-nightfall-comment font-bold py-2 px-4 rounded mt-4 no-underline w-1/4 text-center self-center"
          >
            Got it!
          </button>
        ) : null}
      </div>
    </div>
  );

Notify.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};

export default Notify;
