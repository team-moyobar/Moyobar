import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import axios from "axios";
import { Provider } from "react-redux";
import store from "./redux/store";

axios.defaults.baseURL = "https://i6d210.p.ssafy.io/api/v1";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
