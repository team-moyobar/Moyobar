import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from "./routes/auth/home";
import Signup from "./routes/auth/Signup";
import Login from "./routes/auth/Login";
import Lobby from "./routes/lobby/Lobby";
import Profile from "./routes/auth/Profile";

import Room from "./routes/room/Room.js";

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/" exact component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/lobby" component={Lobby} />
        <Route path="/profile/:userId" component={Profile} />
        <Route path="/room/:roomId" component={Room} />
      </Router>
    </div>
  );
}

export default App;
