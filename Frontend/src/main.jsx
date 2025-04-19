import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import UserLogin from "./Pages/UserLogin";
import UserSignup from "./Pages/UserSignup";
import Home from "./Pages/Home";
import { Toaster } from "react-hot-toast";
// App.js or index.js
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

// Add all solid icons to the library
library.add(fas);


createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Toaster position="top-right" reverseOrder={false} />
    <Routes>
      <Route path="/" element={<UserLogin />} />
      <Route path="/userSignup" element={<UserSignup />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  </BrowserRouter>
);
