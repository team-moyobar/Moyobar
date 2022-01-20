import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from "./routes/Home";
import Signup from './routes/Signup';
import Nav from './components/Nav';
import Login from './routes/Login';

function App() {
  return (
    <div className="App">
      <Router>
        <Nav/>
        <Route path="/" exact component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
      </Router>
    </div>
  );
}

export default App;
