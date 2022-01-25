import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <ul className="nav nav-fill bg-info mb-3 p-3">
      <li className="nav-item">
        <Link to="/">홈</Link>
      </li>
      <li className="nav-item">
        <Link to="/signup">회원가입</Link>
      </li>
      <li className="nav-item">
        <Link to="/googleLogin">구글로그인</Link>
      </li>
      <li className="nav-item">
        <Link to="/login">로그인</Link>
      </li>
      <li className="nav-item">
        <Link to="/profile">프로필</Link>
      </li>
      <li className="nav-item">
        <Link to="/lobby">로비</Link>
      </li>
    </ul>
  );
}
