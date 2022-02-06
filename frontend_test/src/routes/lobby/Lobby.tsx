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
import { createTheme, ThemeProvider } from '@mui/material/styles';

//로비 전체 다크 테마로 변경
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: '#e3f2fd',
      main: '#90caf9',
      dark: '#42a5f5',
      contrastText: '#fff',
    },
    secondary: {
      light: '#f3e5f5',
      main: '#ce93d8',
      dark: '#ab47bc',
      contrastText: '#fff',
    }
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
  const ID = getCookie("userId");
  const [users, setUsers] = useState<UserProps[]>([])
  const [items, setItems] = useState<ItemProps[]>([]);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  const handleLoad = ({searchBy='null' , keyword='null' } : any) => {
    const query = `&page=${page}&size=${size}&searchBy=${searchBy}&keyword=${keyword}`;
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
        console.log(query)
        result = res.data;
        const { content } = result;
        setItems(content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        console.log(err);
        console.log("fail...");
        console.log(query)
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
    <ThemeProvider theme={darkTheme}>
      <div className="lobby-page-container">
        {/* <div className="lobby-header">로비</div> */}
        <div className="lobby-side-bar lobby-form">
          <LobbySideBar items={users} />
        </div>
        <div className="lobby-main-contents lobby-form">
          <div className="lobby-header">
            <h1>Lobby</h1>
          </div>
          <div className="lobby-main-contents-buttons">
            <LobbyCreateRoom />
            <LobbyRoomSearchBar onSubmit={handleLoad}/>
            <LobbyRoomOrder onClick={handleLoad}/>
          </div>
          <LobbyRoomList items={items} />
          <div className="lobby-main-contents-pagination">
            <LobbyPagination totalPages={totalPages} onChange={handleChange}  />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
