import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Docs } from "./pages/Docs";
import { Showcase } from "./pages/Showcase";
import "solid-glass/css";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="docs" element={<Docs />} />
          <Route path="showcase" element={<Showcase />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
