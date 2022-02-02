import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { rootReducer } from "./features";
import axios from "axios";

const store = createStore(rootReducer);
axios.defaults.baseURL = "https://i6d210.p.ssafy.io/api/v1";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
