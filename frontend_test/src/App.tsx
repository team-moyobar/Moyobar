import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./routes/Home";
import Signup from "./routes/auth/Signup";
import Login from "./routes/auth/Login";
import Profile from "./routes/auth/Profile";
import Lobby from "./routes/lobby/Lobby";
import GoogleLogin from "./routes/auth/GoogleLogin";
import Room from "./routes/room/Room";

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/" exact component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/googleLogin" component={GoogleLogin} />
        <Route path="/profile" component={Profile} />
        <Route path="/lobby" component={Lobby} />
        <Route path="/room/:roomId" component={Room} />
      </Router>
    </div>
  );
}

export default App;
