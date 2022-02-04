import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import axios from "axios";

axios.defaults.baseURL = "https://i6d210.p.ssafy.io/api/v1";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
