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
import Paper from "@mui/material/Paper";

import { getToken } from "../../routes/auth/Login";
import { VoteDlg } from "./VoteDlg";

import "./Liar.css";

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

  const gameTime = useRef(180); // 게임시간
  const gameStart = useRef(false); // 게임 시작 여부
  const voteUser = useRef(""); // 투표 유저
  const playerCntRef = useRef(0); // 플레이어 수

  const [gameTimeSec, setGameTimeSec] = useState(180); // 게임시간
  const [userList, setUserList] = React.useState([""]); // 방에있는 사용자 정보
  const [subject, setSubject] = React.useState("동물"); // 게임 주제
  const [role, setRole] = useState(""); // 역할 (Player or Liar)
  const [keyword, setKeyword] = useState(""); // 제시어

  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("");

  const [isGameStart, setIsGameStart] = React.useState(false);
  const [isGameResult, setIsGameResult] = React.useState(false);

  const [liar, setLiar] = React.useState(""); // 라이어
  const [voteCnt, setVoteCnt] = React.useState(0); // 투표 개수
  const [playerCnt, setPlayerCnt] = React.useState(0); // 플레이어 수
  const [voteRes, setVoteRes] = React.useState<voteResultObj[]>([]); // 투표 결과
  const [winner, setWinner] = React.useState(""); // 승리

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
    voteUser.current = value;

    if (client !== null) {
      client.publish({
        destination: "/to/liar/vote/" + roomId,
        body: JSON.stringify({
          voter: nickName,
          vote: value,
        }),
      });
    }
  };

  const subScribeStart = () => {
    if (client !== null) {
      client.subscribe("/from/liar/start/" + roomId, (data: any) => {
        let obj: gameDataObj[] = JSON.parse(data.body);

        let userList: string[] = [];

        for (let i = 0; i < obj.length; i++) {
          if (obj[i].nickname === nickName) {
            // 플레이어에 해당하는 역할 설정
            setRole(obj[i].roletype);
            // 플레이어에 해당하는 제시어 설정
            setKeyword(obj[i].keyword);
          } else {
            userList.push(obj[i].nickname);
          }
        }

        playerCntRef.current = obj.length;
        setPlayerCnt(playerCntRef.current);

        setVoteCnt(0);
        setUserList(userList);
        setSelectedValue("");

        gameStart.current = true;
        gameTime.current = 180;

        setVoteRes([]);

        setIsGameStart(true);
        setIsGameResult(false);
      });
    }
  };

  // 투표 메시지 처리
  const subScribeVote = () => {
    if (client !== null) {
      client.subscribe("/from/liar/vote/" + roomId, (data: any) => {
        let votecnt: number = JSON.parse(data.body).votecnt;

        setVoteCnt(votecnt);

        // 플레이어 수 = 투표 수 인경우 게임 종료
        if (votecnt === playerCntRef.current) {
          gameStart.current = false;
          // 5초이후에 결과요청 호출
          setTimeout(() => {
            requestResult();
          }, 5000);
        }
      });
    }
  };

  // 게임 결과 메시지 처리
  const subScribeResult = () => {
    if (client !== null) {
      client.subscribe("/from/liar/result/" + roomId, (data: any) => {
        let result: gameResultObj = JSON.parse(data.body);
        setLiar(result.liar);

        let voteresult: voteResultObj[] = result.voteresult;
        setVoteRes(voteresult);

        setWinner(result.winner);

        setIsGameStart(false);
        setIsGameResult(true);
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
        // client.publish({
        //   destination: "/to/liar/vote/" + roomId,
        //   body: JSON.stringify({
        //     voter: nickName,
        //     vote: voteUser.current,
        //   }),
        // });
        gameStart.current = false;

        // 5초이후에 결과요청 호출
        setTimeout(() => {
          requestResult();
        }, 5000);
      }
    }
  };

  const requestResult = () => {
    if (client !== null) {
      client.publish({
        destination: "/to/liar/result/" + roomId,
      });
    }
  };

  const connect = () => {
    client = new Client({
      //brokerURL: "ws://localhost:8080/moyobar/websocket",
      brokerURL: "wss://i6d210.p.ssafy.io/moyobar/websocket",
      reconnectDelay: 10000, // 재접속 시간 10초
      onConnect: () => {
        subScribeStart(); // 게임 시작 메시지 처리
        subScribeVote(); // 투표 메시지 처리
        subScribeResult(); // 게임 결과 메시지 처리
      },
    });

    client.activate();
  };

  const handler = () => {
    if (client !== null) {
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
    <div className="liar-component">
      <div>
        <h3>&lt;라이어게임&gt;</h3>
      </div>
      {nickName === owner && isGameStart === false && (
        <Stack spacing={2} direction="row">
          <Paper style={{ width: 150, maxHeight: 400, overflow: "auto" }}>
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
          </Paper>
          <Button variant="contained" onClick={handler}>
            게임 시작
          </Button>
        </Stack>
      )}
      {role === "LIAR" && isGameStart === true && (
        <div>
          <div>
            <h3>당신은 [라이어] 입니다</h3>
          </div>
        </div>
      )}
      {role !== "LIAR" && isGameStart === true && (
        <div>
          <div>
            <h3>당신은 [라이어]가 아닙니다</h3>
          </div>
          <div>
            <h3>당신의 제시어는 [{keyword}]</h3>
          </div>
        </div>
      )}
      {isGameStart === true && (
        <div>
          <h4>남은 게임 시간: {gameTimeSec} 초</h4>
        </div>
      )}
      {isGameStart === true && (
        <div>
          <Button variant="contained" onClick={handleClickOpen}>
            <h4>투표하기</h4>
          </Button>
        </div>
      )}
      {isGameStart === true && (
        <div>
          <h4>
            투표 진행 상황 : {voteCnt} / {playerCnt}
          </h4>
        </div>
      )}
      {isGameStart === true && (
        <div>
          <h4>당신이 선택한 라이어: {selectedValue}</h4>
        </div>
      )}
      <VoteDlg
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        users={userList}
      />
      {isGameResult === true && (
        <div>
          <h2>게임결과</h2>
          <div>
            <h3>라이어 : [{liar}]</h3>
          </div>
          <h2>투표결과</h2>
          <ul>
            {voteRes.map((voteres) => (
              <li key={voteres.nickname}>
                {voteres.nickname} : {voteres.votecnt} 표
              </li>
            ))}
          </ul>
          {winner === "liar" && (
            <div>
              <h3>라이어의 승리입니다!!</h3>
            </div>
          )}
          {winner !== "liar" && (
            <div>
              <h3>라이어의 패배입니다!!</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StompLiar;
