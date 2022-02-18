import "./home.css";
import { useHistory } from "react-router-dom";
import { useState } from "react";
export default function Home() {
  const history = useHistory();

  const [move, setMove] = useState<boolean>(false);

  function routeLogin() {
    setMove(true);
    setTimeout(function () {
      history.push("/login");
    }, 1000);
  }

  return (
    <div className={`home-container ${move ? "login-move" : ""}`}>
      <div className="home-box">
        <div className="neon">MOYOBAR </div>
        <button onClick={routeLogin} className="home-button">
          입장하기
        </button>
      </div>
    </div>
  );
}
