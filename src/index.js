import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Register Service Worker for PWA + background
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("✅ Service Worker enregistré:", reg.scope);
      })
      .catch((err) => {
        console.log("❌ Service Worker erreur:", err);
      });
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
