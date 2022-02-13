import "./Lobby.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import LobbySideBar from "../../components/lobby/LobbySideBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../auth/Login";
import LobbyPagination from "../../components/lobby/LobbyPagination";
import LobbyRoomOrder from "../../components/lobby/LobbyRoomOrder";
import LobbyRoomSearchBar from "../../components/lobby/LobbyRoomSearchBar";
import LobbyCreateRoom from "../../components/lobby/LobbyCreateRoom";
import LobbyRoomList from "../../components/lobby/LobbyRoomList";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Logout from "../../components/auth/Logout";
import { useHistory } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import { ConnectedTv } from "@mui/icons-material";

var client: Client | null = null;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: "#e3f2fd",
      main: "#90caf9",
      dark: "#42a5f5",
      contrastText: "#fff",
    },
    secondary: {
      light: "#f3e5f5",
      main: "#ce93d8",
      dark: "#ab47bc",
      contrastText: "#fff",
    },
  },
});

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
  const [users, setUsers] = useState<UserProps[]>([]);
  const [items, setItems] = useState<ItemProps[]>([]);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  const history = useHistory();

  const nickname = useSelector(
    (state: RootState) => state.authReducer.nickname
  );

  const handleLoad = ({ searchBy = "null", keyword = "null" }: any) => {
    const query = `&page=${page}&size=${size}&searchBy=${searchBy}&keyword=${keyword}`;
    const TOKEN = getToken("jwtToken");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    };

    let result;

    axios
      .get(`/rooms?${query}`, config)
      .then((res) => {
        result = res.data;
        const { content } = result;
        setItems(content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUserLoad = () => {
    const TOKEN = getToken("jwtToken");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    };

    axios
      .get("/users/online", config)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (value: any) => {
    setPage(value);
  };

  const routeMyProfile = () => {
    history.push(`/profile/${nickname}`);
  };

  const connect = () => {
    client = new Client({
      // brokerURL: "ws://localhost:8080/moyobar/websocket",
      brokerURL: "ws://i6d210.p.ssafy.io:8080/moyobar/websocket",
      reconnectDelay: 10000, // 재접속 시간 10초
      // debug: function (str) {
      //   console.log(str);
      // },
      onConnect: () => {
        console.log("connected");
        subscribeLobbyChanged();
        subscribeUsersChanged();
      },
    });

    client.activate();
  };

  const subscribeLobbyChanged = () => {
    if (client != null) {
      client.subscribe("/from/lobby/rooms", (data: any) => {
        let temp = JSON.parse(data.body);
        console.log("로비 업데이트!");
        console.log(temp);
        handleLoad({ title, page, size });
      });
    }
  };
  const subscribeUsersChanged = () => {
    if (client != null) {
      client.subscribe("/from/lobby/users", (data: any) => {
        let temp = JSON.parse(data.body);
        console.log(temp);
        console.log("유저 업데이트!");
        handleUserLoad();
      });
    }
  };

  useEffect(() => {
    console.log(getToken("jwtToken"));
    handleLoad({ title, page, size });
    handleUserLoad();
    connect();
    if (getToken("jwtToken") === undefined) {
      history.push("/login");
    }
  }, [page]);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="lobby-container">
        <div className="lobby-header">
          <div className="header-container">
          <p className="my-profile" onClick={routeMyProfile}>
            mypage
          </p>
          <Logout />
          </div>
        </div>
        <div className="lobby-main">
          <div className="left-container">
            <div className="left-title">
              <h3>user list</h3>
            </div>
            <div className="lobby-left">
              <LobbySideBar items={users} />
            </div>
          </div>
          <div className="lobby-right">
            <div className="lobby-button">
              <LobbyCreateRoom />
              <LobbyRoomSearchBar onSubmit={handleLoad} />
              <LobbyRoomOrder onClick={handleLoad} />
            </div>
            <div className="lobby-room-list">
              <LobbyRoomList items={items} />
            </div>
            <div className="lobby-pagination">
              <LobbyPagination
                totalPages={totalPages}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
