import "./Room.css";
import { useParams, useLocation } from "react-router";
import UserCamera from "../../components/room/UserCamera.js";

export default function Room() {
  const { roomId, owner } = useParams();

  const location = useLocation();

  const roomInfo = location.state.roomInfo;

  return (
    <div className="room-root-container">
      <UserCamera roomId={roomId} owner={owner} roomInfo={roomInfo}/>
    </div>
  );
}
