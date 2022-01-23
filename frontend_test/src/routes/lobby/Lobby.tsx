import LobbyRoomList from "../../components/lobby/LobbyRoomList";
import LobbySideBar from "../../components/lobby/LobbySideBar";
import LobbyRoomSearchBar from "../../components/lobby/LobbyRoomSearchBar";
import LobbyCreateRoom from "../../components/lobby/LobbyCreateRoom";

export default function Lobby() {
  return (
    <div className="container mt-5">
      <h1>로비</h1>
      <div className="row">
        <div
          className="col-8 bg-white p-3"
          style={{
            padding: "5rem",
            border: "solid 2px",
          }}
        >
          <LobbyCreateRoom />
          <LobbyRoomSearchBar></LobbyRoomSearchBar>
          <LobbyRoomList></LobbyRoomList>
        </div>
        <div
          className="col-4 bg-white p-3"
          style={{
            padding: "5rem",
            border: "solid 2px",
          }}
        >
          <LobbySideBar></LobbySideBar>
        </div>
      </div>
    </div>
  );
}
