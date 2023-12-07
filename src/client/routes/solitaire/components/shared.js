/* Copyright G. Hemingway, @2023 - All rights reserved */
"use strict";

import PropTypes from "prop-types";
import React from "react";

export const ErrorMessage = ({ msg = "", hide = false }) => {
  return (
    <div className={`${hide ? "hidden" : ""} text-nightfall-variable text-center py-4`}>
      {msg}
    </div>
  );
};

ErrorMessage.propTypes = {
  msg: PropTypes.string,
  hide: PropTypes.bool,
};

export const ModalNotify = ({ msg = "", onAccept, ...props }) => {
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-nightfall-background bg-opacity-75 z-50"
      {...props}
    >
      <div className="bg-nightfall-background border border-nightfall-highlight rounded-xl p-4 max-w-md w-full m-4 flex flex-col items-center shadow-lg">
        <p>{msg}</p>
        {onAccept ? (
          <button
            onClick={onAccept}
            className="bg-nightfall-highlight hover:bg-nightfall-comment font-bold py-2 px-4 rounded mt-4 no-underline w-11 text-center self-center w-1/6"
          >
            OK
          </button>
        ) : null}
      </div>
    </div>
  );
};

ModalNotify.propTypes = {
  msg: PropTypes.string,
  onAccept: PropTypes.func,
};

export const FormBase = ({ children, ...props }) => (
  <form className="grid grid-cols-2 gap-4 p-1 md:p-4" {...props}>
    {children}
  </form>
);

FormBase.propTypes = {
  children: PropTypes.node.isRequired,
};

export const FormInput = ({ id, name, type, placeholder, value, onChange }) => (
  <input
    id={id}
    name={name}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="border border-gray-300 rounded py-2 px-3 w-3/4"
  />
);

FormInput.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export const InfoBlock = ({ children }) => (
  <div className="grid grid-cols-2 gap-4">{children}</div>
);

InfoBlock.propTypes = {
  children: PropTypes.node.isRequired,
};

export const InfoData = ({ children }) => (
  <div className="overflow-hidden whitespace-nowrap text-ellipsis p-2">
    {children}
  </div>
);

InfoData.propTypes = {
  children: PropTypes.node.isRequired,
};

export const InfoLabels = ({ children }) => (
  <div className="font-bold flex flex-col items-end p-2 text-nightfall-function">{children}</div>
);

InfoLabels.propTypes = {
  children: PropTypes.node.isRequired,
};

export const ShortP = ({ children }) => (
  <p className="overflow-hidden whitespace-nowrap text-ellipsis p-1">
    {children}
  </p>
);

ShortP.propTypes = {
  children: PropTypes.node.isRequired,
};

export const Edits = ({ children }) => (
  <div className="flex flex-col items-stretch">{children}</div>
);

Edits.propTypes = {
  children: PropTypes.node.isRequired,
};

export const EditStr = ({ name, onSubmit, onChange, onCancel }) => (
  <div className="flex items-center justify-center">
    <input
      onChange={onChange}
      placeholder={name}
      className="border border-nightfall-comment bg-nightfall-highlight rounded px-2 py-1 w-3/4 m-2"
    />
    <i
      onClick={onSubmit}
      className="text-green-500 cursor-pointer mx-1 hover:text-green-700"
    >
      &#x2714;
    </i>
    <i
      onClick={onCancel}
      className="text-red-600 cursor-pointer mx-1 hover:text-red-800"
    >
      &#x2716;
    </i>
  </div>
);

EditStr.propTypes = {
  name: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export const Edit = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="bg-nightfall-background text-white rounded cursor-pointer m-2 h-5 hover:bg-nightfall-comment text-center items-center"
  >
    {children}
  </button>
);

Edit.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
