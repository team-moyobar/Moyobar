import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { useParams } from "react-router";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { getToken } from "../../routes/auth/Login";
import { VoteDlg } from "./VoteDlg";

// stomp client 변수
var client: Client | null = null;

// 타이머 변수
var timer: NodeJS.Timer | null = null;

// 라이어 게임 인터페이스
export interface gameDataObj {
  nickname: string;
  roletype: string;
  keyword: string;
}

// 라이어 게임결과 인터페이스
export interface gameResultObj {
  liar: string;
  voteresult: voteResultObj[];
  winner: string;
}

// 라이어 투표결과 인터페이스
export interface voteResultObj {
  nickname: string;
  votecnt: string;
}

const StompLiar = () => {
  const nickName = getToken("nickname");
  const { roomId } = useParams<{ roomId?: string }>();
  const { owner } = useParams<{ owner?: string }>();

  // const [nickName, setNickName] = useState("test10");
  // const [roomId, setRoomId] = useState("17");

  const gameTime = useRef(10); // 게임시간
  const voteTime = useRef(10); // 투표시간
  const gameStart = useRef(false); // 게임 시작 여부
  const voteUser = useRef(""); // 투표 유저

  const [gameTimeSec, setGameTimeSec] = useState(10); // 게임시간
  const [userList, setUserList] = React.useState([""]); // 방에있는 사용자 정보
  const [subject, setSubject] = React.useState("동물"); // 게임 주제
  //const [role, setRole] = useState(""); // 역할 (Player or Liar)
  const [keyword, setKeyword] = useState(""); // 제시어

  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("");

  const [liar, setLiar] = React.useState(""); //
  const [voteRes, setVoteRes] = React.useState<voteResultObj[]>([]); // 투표 결과
  const [winner, setWinner] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
    voteUser.current = value;
  };

  const subscribe = () => {
    if (client != null) {
      client.subscribe("/from/liar/start/" + roomId, (data: any) => {
        let obj: gameDataObj[] = JSON.parse(data.body);

        let userList: string[] = [];

        for (let i = 0; i < obj.length; i++) {
          if (obj[i].nickname === nickName) {
            // setRole(obj[i].roletype);
            // 플레이어에 해당하는 제시어 설정
            setKeyword(obj[i].keyword);
          } else {
            userList.push(obj[i].nickname);
          }
        }

        setUserList(userList);

        gameStart.current = true;
        gameTime.current = 10;
        voteTime.current = 10;
      });

      client.subscribe("/from/liar/result/" + roomId, (data: any) => {
        let result: gameResultObj = JSON.parse(data.body);
        setLiar(result.liar);

        let voteresult: voteResultObj[] = result.voteresult;
        setVoteRes(voteresult);

        setWinner(result.winner);
      });
    }
  };

  useEffect(() => {
    connect(); // Stomp 연결 설정
    timer = setInterval(() => {
      processGame(); // 게임진행 처리
    }, 1000);
    return () => clearObject();
  }, []);

  // 게임 진행 처리
  const processGame = () => {
    if (gameStart.current === true) {
      gameTime.current--; // 게임 진행 시간(초) 감소

      setGameTimeSec(gameTime.current);

      if (gameTime.current <= 0 && client != null) {
        client.publish({
          destination: "/to/liar/vote/" + roomId,
          body: JSON.stringify({
            vote: voteUser.current,
          }),
        });
        gameStart.current = false;

        // 5초이후에 결과요청 호출
        setTimeout(() => {
          requestResult();
        }, 5000);
      }
    }
  };

  const requestResult = () => {
    if (client != null) {
      client.publish({
        destination: "/to/liar/result/" + roomId,
      });
    }
  };

  const connect = () => {
    client = new Client({
      //brokerURL: "ws://localhost:8080/moyobar/websocket",
      brokerURL: "ws://i6d210.p.ssafy.io:8080/moyobar/websocket",
      reconnectDelay: 10000, // 재접속 시간 10초
      // debug: function (str) {
      //   console.log(str);
      // },
      onConnect: () => {
        subscribe();
      },
    });

    client.activate();
  };

  const handler = () => {
    if (client != null) {
      if (!client.connected) return;

      client.publish({
        destination: "/to/liar/start/" + roomId,
        body: JSON.stringify({
          subject: subject,
        }),
      });
    }
  };

  const clearObject = () => {
    if (client != null) {
      if (client.connected) client.deactivate();
    }

    if (timer != null) {
      clearInterval(timer);
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSubject(event.target.value as string);
  };

  return (
    <>
      <div>
        <h1>
          {roomId} 번방 {nickName} 님 환영합니다
        </h1>
      </div>
      {nickName === owner && (
        <Stack spacing={2} direction="row">
          <Box sx={{ minWidth: 120 }}>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-label">주제</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={subject}
                label="주제"
                onChange={handleChange}
              >
                <MenuItem value={"동물"}>동물</MenuItem>
                <MenuItem value={"나라"}>나라</MenuItem>
                <MenuItem value={"음식"}>음식</MenuItem>
                <MenuItem value={"영화"}>영화</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button variant="contained" onClick={handler}>
            Game Start
          </Button>
        </Stack>
      )}
      <div>
        <h3>당신이 받은 제시어는 {keyword} 입니다. 라이어를 찾으세요!</h3>
        {/* <h3>당신은 {} 입니다. 라이어를 찾으세요!</h3> */}
      </div>
      <div>
        <h3>남은 게임시간 {gameTimeSec} 초.</h3>
      </div>
      {/* <div>
        <h3>남은 투표시간 {voteTimeSec} 초.</h3>
      </div> */}
      {/* <h3>참가자 목록</h3>
      <ol>
        {userList.map((userNickName) => (
          <li key={userNickName}>{userNickName}</li>
        ))}
      </ol> */}
      <div>
        <Button variant="outlined" onClick={handleClickOpen}>
          투표하기
        </Button>
        <VoteDlg
          selectedValue={selectedValue}
          open={open}
          onClose={handleClose}
          users={userList}
        />
        <Typography variant="subtitle1" component="div">
          당신이 선택한 라이어: {selectedValue}
        </Typography>
        <br />
      </div>
      <h2>게임결과</h2>
      <div>라이어 : [{liar}]</div>
      <h3>투표결과</h3>
      <ul>
        {voteRes.map((voteres) => (
          <li key={voteres.nickname}>
            {voteres.nickname} : {voteres.votecnt}
          </li>
        ))}
      </ul>
      <div>[{winner}]의 승리입니다!!</div>
    </>
  );
};

export default StompLiar;
