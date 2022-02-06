import "./home.css";
import { useHistory } from "react-router-dom";

export default function Home() {
  const history = useHistory();

  function routeLogin() {
    history.push("/login");
  }

  return (
    <div className="home-container">
      <div className="home-box">
        <img src="/images/logo1.png" alt="" />
        <button onClick={routeLogin} className="home-button">
          입장하기
        </button>
      </div>
    </div>
  );
}
