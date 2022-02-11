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
    }, 800);
  }

  return (
    <div className={`home-container ${move ? "login-move" : ""}`}>
      <div className="home-box">
        <img src="/images/auth/logo.png" alt="" />
        <button onClick={routeLogin} className="home-button">
          입장하기
        </button>
      </div>
    </div>
  );
}
