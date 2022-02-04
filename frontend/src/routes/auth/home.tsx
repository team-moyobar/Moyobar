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
        <h1>MOYOBAR</h1>
        <button onClick={routeLogin} className="home-button">
          입장하기
        </button>
      </div>
    </div>
  );
}
