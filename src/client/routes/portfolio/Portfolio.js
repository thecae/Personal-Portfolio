"use strict";

import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";

const Portfolio = () => {
  const player = React.createRef();

  return (
    <Player
      ref={player}
      autoplay={true}
      loop={true}
      controls={true}
      src="https://lottie.host/0a7f7158-b95c-448d-a688-aae1027190cc/LLlGktJFB8.json"
      style={{ height: "300px", width: "300px" }}
    ></Player>
  );
};

export default Portfolio;
