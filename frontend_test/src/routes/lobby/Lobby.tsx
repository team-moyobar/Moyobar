import LobbyRoomList from "../../components/lobby/LobbyRoomList";
import LobbySideBar from "../../components/lobby/LobbySideBar";
import LobbyRoomSearchBar from "../../components/lobby/LobbyRoomSearchBar";
export default function Lobby() {
  return (
    <div className="container mt-5">
      <h1>로비</h1>
      <div className="row">
        <div className="col-8 bg-info p-3">
          <LobbyRoomSearchBar></LobbyRoomSearchBar>
          <LobbyRoomList></LobbyRoomList>
        </div>
        <div className="col-4 bg-dark text-white p-3">
          <LobbySideBar></LobbySideBar>
        </div>
      </div>
    </div>
  );
}
