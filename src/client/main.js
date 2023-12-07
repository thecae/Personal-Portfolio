"use strict";

import React, { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

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
const Portfolio = lazy(() => import("./routes/portfolio/page.js"));

// solitaire
const Solitaire = lazy(() => import("./routes/solitaire/main.js"));

const Fallback = () => (
  <div className="flex justify-center items-center h-screen text-5xl text-gray-600 font-light">
    Loading ..
  </div>
);

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

        <Route exact path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

const root = createRoot(document.getElementById("root"));
root.render(<App />);
