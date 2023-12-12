"use strict";

import React, { createRef, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";

// components
import Header from "./routes/header.js";
const NotFound = lazy(() => import("./routes/not_found.js"));

// main page
const Home = lazy(() => import("./routes/main/home.js"));
const Contact = lazy(() => import("./routes/main/contact.js"));

// escape rooms
const EscapeRooms = lazy(() => import("./routes/escaperooms/landing.js"));
const Blog = lazy(() => import("./routes/escaperooms/blog.js"));

// portfolio
const Portfolio = lazy(() => import("./routes/portfolio/Portfolio.js"));

// solitaire
const Solitaire = lazy(() => import("./routes/solitaire/main.js"));

// physics
const Physics = lazy(() => import("./routes/physics/Physics.js"));

const Fallback = () => {
  const player = createRef();
  return (
    <Player
      ref={player}
      autoplay={true}
      loop={true}
      controls={true}
      src="https://lottie.host/40f6282e-f601-4525-880e-13320284f5ed/28clpVf8o5.json"
      style={{ height: "300px", width: "300px" }}
      className="flex justify-center items-center"
    />
  );
};

// router setup
const App = () => (
  <BrowserRouter>
    <Header />
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/escape" element={<EscapeRooms />} />
        <Route path="/escape/blog/:slug" element={<Blog />} />

        <Route path="/portfolio" element={<Portfolio />} />

        <Route path="/solitaire/*" element={<Solitaire />} />

        <Route path="/physics" element={<Physics />} />

        <Route exact path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

const root = createRoot(document.getElementById("root"));
root.render(<App />);
