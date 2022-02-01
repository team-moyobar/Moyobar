import LobbyRoomList from "../../components/lobby/LobbyRoomList";
import LobbySideBar from "../../components/lobby/LobbySideBar";
import LobbyRoomSearchBar from "../../components/lobby/LobbyRoomSearchBar";
import LobbyCreateRoom from "../../components/lobby/LobbyCreateRoom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Lobby.css";
import { getCookie } from "../auth/Login";

interface IProps {
  title: string;
  membercount: number;
  privateroom: boolean;
}

export default function Lobby() {
  const ID = getCookie("userId");
  const [items, setItems] = useState<IProps[]>([]);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);

  const handleLoad = (options: any) => {
    const query = `&page=1&size=6`;
    const TOKEN = getCookie("jwtToken");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    };

    console.log(config);

    let result;
    axios
      .get(`http://i6d210.p.ssafy.io:8080/api/v1/rooms?${query}`, config)
      .then((res) => {
        console.log("success");
        console.log(res.data.content);
        result = res.data;
        const { content } = result;
        setItems(content);
      })
      .catch((err) => {
        console.log(err);
        console.log("fail...");
      });
  };

  useEffect(() => {
    handleLoad({ title, page, size });
  }, []);

  return (
    <div className="lobby-page-container">
        <div className="lobby-header">
          <h1>로비</h1>
        </div>
        <div className="lobby-side-bar lobby-form" >
          <LobbySideBar></LobbySideBar>
        </div>
        <div className="lobby-main-contents lobby-form">
          <h4>{ID}님 환영합니다.</h4>
          <LobbyCreateRoom />
          <LobbyRoomSearchBar></LobbyRoomSearchBar>
          <LobbyRoomList items={items} />
        </div>
    </div>
  );
}
