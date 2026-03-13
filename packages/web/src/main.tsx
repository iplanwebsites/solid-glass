import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Docs } from "./pages/Docs";
import { Gallery } from "./pages/Gallery";
import { Showcase } from "./pages/Showcase";
import { Components } from "./pages/Components";
import { Kitchen } from "./pages/Kitchen";
import "solid-glass/css";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="docs" element={<Docs />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="showcase" element={<Showcase />} />
          <Route path="components" element={<Components />} />
          <Route path="kitchen" element={<Kitchen />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
