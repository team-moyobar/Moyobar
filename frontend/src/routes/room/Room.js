import "./Room.css";
import { useParams } from "react-router";

import UserCamera from '../../components/room/UserCamera.js'

export default function Room() {
  const { roomId } = useParams();

  return (
    <div>
      <UserCamera roomId={roomId} />
    </div>
  );
}
