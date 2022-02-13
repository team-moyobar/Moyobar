import Cookies from "universal-cookie";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logoutCheck } from "../../redux/auth/action";
import { useHistory } from "react-router-dom";
import { getToken } from "../../routes/auth/Login";
import "./Logout.css";

export default function Logout() {
  const dispatch = useDispatch();
  const history = useHistory();
  const cookies = new Cookies();
  const TOKEN = getToken("jwtToken");

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  };

  function handlelogout() {
    if (TOKEN) {
      axios
        .get("/auth/logout", config)
        .then((res) => {
          alert("로그아웃 되었습니다.");
          dispatch(logoutCheck());
          cookies.remove("jwtToken");
          cookies.remove("nickname");
          history.push("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  return (
    <p className="logout-button" onClick={handlelogout}>
      logout
    </p>
  );
}
