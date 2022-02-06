import "./Lobby.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function Lobby() {
  const login = useSelector(
    (state: RootState) => state.authReducer.isLogin
  );
  const userInfo = useSelector(
    (state: RootState) => state.authReducer.nickname
  );
  return <div>Lobby
    <p>{userInfo}</p>
    <p>{login}</p>
  </div>;
}
