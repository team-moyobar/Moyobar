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

    const TOKEN = getCookie("jwtToken");
    console.log(ID);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    };

    let result;
    axios
      .get(`http://i6d210.p.ssafy.io:8080/api/v1/rooms?${query}`, config)
      .then((res) => {
        console.log("success");
        console.log(res);
        result = res;
      })
      .catch((err) => {
        console.log(err);
        console.log("fail...");
      });

    result = {
      contents: [
        { title: "초보만", membercount: 4, privateroom: false },
        { title: "모여바 테이블", membercount: 6, privateroom: true },
        { title: "한신포차", membercount: 6, privateroom: true },
        { title: "라이어게임", membercount: 6, privateroom: true },
        { title: "훈민정음 고수", membercount: 6, privateroom: true },
        { title: "안녕하세요", membercount: 6, privateroom: true },
      ],
    };
    const { contents } = result;
    setItems(contents);
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
