import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-page-container">
      <div className="home-box">
        <h1>moyoBar</h1>
        <div className="home-button-container">
          <Link to="/login">
            <button className="home-button">로그인</button>
          </Link>
          <Link to="/signup">
            <button className="home-button">회원가입</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
