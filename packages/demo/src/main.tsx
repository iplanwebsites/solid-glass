import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { App } from "./App";
import { Playground } from "./pages/Playground";
import { Gallery } from "./pages/Gallery";
import "solid-glass/css";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Gallery />} />
          <Route path="playground" element={<Playground />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
