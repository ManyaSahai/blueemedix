import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Theme from "./Theme";

function App() {
  return (
    <Theme>
      <Navbar />
      <Routes>{}</Routes>
    </Theme>
  );
}

export default App;
