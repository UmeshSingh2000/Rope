import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import UserLogin from "./Pages/UserLogin";
import UserSignup from "./Pages/UserSignup";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<UserLogin />} />
      <Route path="/userSignup" element={<UserSignup />} />
    </Routes>
  </BrowserRouter>
);
