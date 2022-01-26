import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import "./Home.css";

export default function Home() {
  return (
    <div id="main">
      <div id="HomeForm">
        <img id="mainLogo" src="/assets/images/logo.png" alt="" />
        <div className="my-4">
          <Link to="/login">
            <Button variant="contained" color="secondary" id="Button">
              로그인
            </Button>
          </Link>
        </div>
        <div>
          <Link to="/signup">
            <Button variant="contained" color="secondary" id="Button">
              회원가입
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
