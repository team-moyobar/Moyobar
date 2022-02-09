import "./Lobby.css";
import { useSelector, useDispatch } from "react-redux";
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

  const isLogin = useSelector((state: RootState) => state.authReducer.isLogin);

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

  useEffect(() => {
    handleLoad({ title, page, size });
    handleUserLoad();
    if (isLogin === false) {
      history.push("/login");
    }
  }, [page]);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="lobby-container">
        <div className="lobby-header">
          <p>{nickname}</p>
          <Logout />
        </div>
        <div className="lobby-main">
          <div className="lobby-left">
            <h3>접속 유저 리스트</h3>
            <LobbySideBar items={users} />
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
