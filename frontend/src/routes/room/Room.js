import "./Room.css";
import { useParams } from "react-router";

import UserCamera from "../../components/room/UserCamera.js";
import { useEffect } from "react";
import { getToken } from "../auth/Login";
import { useHistory } from "react-router-dom";

export default function Room() {
  const history = useHistory();
  const { roomId, owner } = useParams();

  useEffect(() => {
    if (getToken("jwtToken") === undefined) {
      history.push("/login");
    }
  }, []);

  return (
    <div>
      <UserCamera roomId={roomId} owner={owner} />
    </div>
  );
}
