import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import "./Home.css";

import GLogin from "../components/auth/GLogin";
import KLogin from "../components/auth/KLogin";

export default function Home() {
  return (
    <div id="main">
      <div id="HomeForm">
        <h1>moyoBar</h1>
        <div id="button-container">
          <Link to="/login">
            <button id="home-button">로그인</button>
          </Link>
          <Link to="/signup">
            <button id="home-button">회원가입</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
