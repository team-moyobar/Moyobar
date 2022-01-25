import LobbyRoomList from "../../components/lobby/LobbyRoomList";
import LobbySideBar from "../../components/lobby/LobbySideBar";
import LobbyRoomSearchBar from "../../components/lobby/LobbyRoomSearchBar";
import LobbyCreateRoom from "../../components/lobby/LobbyCreateRoom";
import { useEffect, useState } from "react";
import axios from 'axios'

interface IProps  {
  title : string, membercount : number, privateroom : boolean
}

export default function Lobby() {
  
  const[items, setItems] = useState<IProps[]>([])
  const[title, setTitle] = useState('')
  const[page, setPage] = useState(1)
  const[size, setSize] = useState(6)

  const handleLoad = (options: any) => {
    const query = `title=${options.title}&page=${options.page}&size=${options.size} `
    let result
    axios 
      .get(`https://moyobar.herokuapp.com/api/v1/rooms?${query}`)
      .then((res) => {
        console.log("success")
        result = res
      })
      .catch((err) => {
        console.log(err)
        console.log("fail...")
      })

    result = {
      contents : [
        { title: '초보만', membercount: 4, privateroom: false},
        { title: '모여바 테이블', membercount: 6, privateroom: true },
        { title: '한신포차', membercount: 6, privateroom: true },
        { title: '라이어게임', membercount: 6, privateroom: true },
        { title: '훈민정음 고수', membercount: 6, privateroom: true },
        { title: '안녕하세요', membercount: 6, privateroom: true }
      ]
    }
    const { contents } = result
    setItems( contents )
  }

  useEffect(() => {
    handleLoad({ title, page, size})
  },[])

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
          <LobbyRoomList items={items}  />
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
