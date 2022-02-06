import "./Lobby.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function Lobby() {
  const nickname = useSelector(
    (state: RootState) => state.authReducer.nickname
  );
  return (
    <div>
      Lobby
      <p>{nickname}</p>
    </div>
  );
}
