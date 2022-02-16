import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from "./routes/auth/home";
import Signup from "./routes/auth/Signup";
import Login, { getToken } from "./routes/auth/Login";
import Lobby from "./routes/lobby/Lobby";
import Profile from "./routes/auth/Profile";
import Room from "./routes/room/Room.js";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginCheck } from "./redux/auth/action";

function App() {
  const dispatch = useDispatch();
  const nickname = getToken("nickname");

  useEffect(() => {
    if (nickname) {
      dispatch(loginCheck(nickname));
    }
  }, []);

  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
      <Route path="/lobby" component={Lobby} />
      <Route path="/profile/:userNickname" component={Profile} />
      <Route path="/room/:roomId/:owner" component={Room} />
    </Router>
  );
}

export default App;
