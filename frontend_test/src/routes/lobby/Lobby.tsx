import LobbyRoomList from "../../components/lobby/LobbyRoomList";
import LobbySideBar from "../../components/lobby/LobbySideBar";
import LobbyRoomSearchBar from "../../components/lobby/LobbyRoomSearchBar";
import LobbyCreateRoom from "../../components/lobby/LobbyCreateRoom";
import LobbyPagination from "../../components/lobby/LobbyPagination";
import LobbyRoomOrder from "../../components/lobby/LobbyRoomOrder";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Lobby.css";
import { getCookie } from "../auth/Login";

interface ItemProps {
  title: string;
  membercount: number;
  privateroom: boolean;
}

interface UserProps {
  nickname: string;
  birthday: string;
}

export default function Lobby() {
  const ID = getCookie("userId");
  const [users, setUsers] = useState<UserProps[]>([])
  const [items, setItems] = useState<ItemProps[]>([]);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

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
        console.log(res.data)
        console.log(res.data.content);
        result = res.data;
        const { content } = result;
        setItems(content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        console.log(err);
        console.log("fail...");
      });
  };

  const handleUserLoad = () => {
    const TOKEN = getCookie("jwtToken");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    };

    axios
      .get('/users/online', config)
      .then((res) => {
        console.log(res.data)
        setUsers(res.data)
      })
      .catch((err) => {
        console.log(err);
        console.log("fail...")
      })
  }

  const handleChange = (value: any) => {
    setPage(value)
  }

  useEffect(() => {
    handleLoad({ title, page, size });
    handleUserLoad();
  }, [page]);

  return (
    <div className="lobby-page-container">
      <div className="lobby-header"></div>
      <div className="lobby-side-bar lobby-form">
        <LobbySideBar items={users} />
        <LobbyCreateRoom />
        <LobbyRoomSearchBar />
      </div>
      <div className="lobby-main-contents lobby-form">
        <LobbyRoomOrder />
        <LobbyRoomList items={items} />
        <LobbyPagination totalPages={totalPages} onChange={handleChange} />
      </div>
    </div>
  );
}
