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
    // const query = `&page=${options.page}&size=${options.size}`
    const query = `&page=1&size=6`;

    // const TOKEN = getCookie("jwtToken");
    const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0NjZAbmF2ZXIuY29tIiwiaXNzIjoic3NhZnkuY29tIiwiZXhwIjoxNjQ0NjIzNzYzLCJpYXQiOjE2NDMzMjc3NjN9.fOsqVPdaKms4byp0saS009MpmxtXWZI-iG2WFMPOVAox3W3vM_qkBmhZ8S4elazXVasyDFwqXEwH5SHdV5qVuw";

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    };

    console.log(config)

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
    <div className="container mt-5">
      <h1 id="neonText">로비</h1>
      <div className="row">
        <div
          className="col-3 p-3"
          style={{
            padding: "5rem",
            // border: "solid 2px",
          }}
        >
          <div className="p-3 " id="LobbyForm">
            <LobbySideBar></LobbySideBar>
          </div>
        </div>
        <div
          className="col-9  p-3"
          style={{
            padding: "5rem",
            // border: "solid 2px",
          }}
        >
          <div className="p-3 " id="LobbyForm">
            <h4>{ID}님 환영합니다.</h4>
            <LobbyCreateRoom />
            <LobbyRoomSearchBar></LobbyRoomSearchBar>
            <LobbyRoomList items={items} />
          </div>
        </div>
      </div>
    </div>
  );
}
