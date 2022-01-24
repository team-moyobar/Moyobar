import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./routes/Home";
import Signup from "./routes/auth/Signup";
import Nav from "./components/Nav";
import Login from "./routes/auth/Login";
import Profile from "./routes/auth/Profile";
import Lobby from "./routes/lobby/Lobby";
import GoogleLogin from "./routes/auth/GoogleLogin";

function App() {
  return (
    <div className="App">
      <Router>
        <Nav />
        <Route path="/" exact component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/googleLogin" component={GoogleLogin} />
        <Route path="/profile" component={Profile} />
        <Route path="/lobby" component={Lobby} />
      </Router>
    </div>
  );
}

export default App;
