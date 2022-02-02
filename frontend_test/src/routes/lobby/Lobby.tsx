import LobbyRoomList from "../../components/lobby/LobbyRoomList";
import LobbySideBar from "../../components/lobby/LobbySideBar";
import LobbyRoomSearchBar from "../../components/lobby/LobbyRoomSearchBar";
import LobbyCreateRoom from "../../components/lobby/LobbyCreateRoom";
import LobbyPagination from "../../components/lobby/LobbyPagination";
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
    const query = `&page=${page}&size=${size}`;
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
      .get(`/rooms?${query}`, config)
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

  const handleChange = (value: any) => {
    setPage(value)
  }

  useEffect(() => {
    handleLoad({ title, page, size });
  }, [page]);

  return (
    <div className="lobby-page-container">
      <div className="lobby-header"></div>
      <div className="lobby-side-bar lobby-form">
        <LobbySideBar />
        <LobbyCreateRoom />
        <LobbyRoomSearchBar />
      </div>
      <div className="lobby-main-contents lobby-form">
        <LobbyRoomList items={items} />
        <LobbyPagination onChange={handleChange} />
      </div>
    </div>
  );
}
