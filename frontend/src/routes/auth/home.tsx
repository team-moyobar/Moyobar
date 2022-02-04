import "./home.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-box">
        <h1>MOYOBAR</h1>
        <Link to="/login">
          <button className="home-button">입장하기</button>
        </Link>
      </div>
    </div>
  );
}
