import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import UserLogin from "./Pages/UserLogin";
import UserSignup from "./Pages/UserSignup";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Toaster position="top-right" reverseOrder={false} />
    <Routes>
      <Route path="/" element={<UserLogin />} />
      <Route path="/userSignup" element={<UserSignup />} />
    </Routes>
  </BrowserRouter>
);
