/* Copyright G. Hemingway, @2023 - All rights reserved */
"use strict";

import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ logOut }) => {
  let navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      await logOut();
      navigate("/solitaire/login");
    };

    performLogout();
  }, [logOut, navigate]);

  return <></>;
};

Logout.propTypes = {
  logOut: PropTypes.func.isRequired,
};

export default Logout;
