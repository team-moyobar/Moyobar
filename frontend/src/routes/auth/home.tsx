import "./home.css";
import { useHistory } from "react-router-dom";
import { useState } from "react";
export default function Home() {
  const history = useHistory();

  const [move, setMove] = useState<boolean>(false);
  const [logo, setLogo] = useState<boolean>(false);

  function routeLogin() {
    setMove(true);
    setTimeout(function () {
      setLogo(true);
    }, 400);
    setTimeout(function () {
      history.push("/login");
    }, 1300);
  }

  return (
    <div className={`home-container ${move ? "login-move" : ""}`}>
      <div className="home-box">
        <img
          className={`home-img ${logo ? "home-vis" : ""}`}
          src="/images/auth/logo.png"
          alt=""
        />
        <button onClick={routeLogin} className="home-button">
          입장하기
        </button>
      </div>
    </div>
  );
}
