import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { useParams } from "react-router";
// import { SelectChangeEvent } from "@mui/material/Select";

import { getToken } from "../../routes/auth/Login";
import { VoteDlg } from "./VoteDlg";
import { LiarResDlg } from "./LiarResDlg";

import "./Liar.css";

// stomp client 변수
var client: Client | null = null;

// 타이머 변수
var timer: NodeJS.Timer | null = null;

// 라이어 게임 시작 인터페이스
export interface gameStartObj {
  subject: string;
  rolekeyword: gameDataObj[];
}

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

  const [openVoteDlg, setOpenVoteDlg] = React.useState(false); // 투표 창 열기 여부
  const [selectedValue, setSelectedValue] = React.useState(""); // 투표 선택
  const [openResDlg, setOpenResDlg] = React.useState(false); // 게임결과 창 열기 여부

  const [isGameStart, setIsGameStart] = React.useState(false); // 게임시작 여부
  const [isVoted, setIsVoted] = React.useState(false); // 투표 여부

  const [liar, setLiar] = React.useState(""); // 라이어
  const [voteCnt, setVoteCnt] = React.useState(0); // 투표 개수
  const [playerCnt, setPlayerCnt] = React.useState(0); // 플레이어 수
  const [voteRes, setVoteRes] = React.useState<voteResultObj[]>([]); // 투표 결과
  const [winner, setWinner] = React.useState(""); // 승리

  // 투표 다이얼로그 열기
  const handleClickVoteOpen = () => {
    if (isVoted === false) {
      setOpenVoteDlg(true);
    }
  };

  // 투표 다이얼로그 닫기
  const handleVoteClose = (value: string) => {
    setOpenVoteDlg(false);

    // 투표 선택한 사람이 있다면..
    if (value !== "") {
      setSelectedValue(value);
      voteUser.current = value;
      setIsVoted(true); // 투표 여부

      // 투표 전송
      if (client !== null) {
        client.publish({
          destination: "/to/liar/vote/" + roomId,
          body: JSON.stringify({
            voter: nickName,
            vote: value,
          }),
        });
      }
    }
  };

  // 게임결과 창 닫기
  const handleLiarResClose = () => {
    setOpenResDlg(false);
  };

  // 시작 메시지 처리
  const subScribeStart = () => {
    if (client !== null) {
      client.subscribe("/from/liar/start/" + roomId, (data: any) => {
        let result: gameStartObj = JSON.parse(data.body);
        setSubject(result.subject); // 주제 설정

        let obj: gameDataObj[] = result.rolekeyword;

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
        setPlayerCnt(playerCntRef.current); // 플레이어 수 설정

        setIsVoted(false); // 투표 여부 초기화
        setVoteCnt(0); // 투표 갯수 초기화
        setUserList(userList); // 유저 리스트 설정
        setSelectedValue(""); // 투표 유저 초기화

        gameStart.current = true;
        gameTime.current = 180;

        setOpenVoteDlg(false); // 투표창 닫음
        setOpenResDlg(false); // 결과창 닫음

        setIsGameStart(true); // 게임시작 설정
      });
    }
  };

  // 투표 메시지 처리
  const subScribeVote = () => {
    if (client !== null) {
      client.subscribe("/from/liar/vote/" + roomId, (data: any) => {
        let votecnt: number = JSON.parse(data.body).votecnt;

        setVoteCnt(votecnt); // 투표 수 설정

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

        setLiar(result.liar); // 라이어 설정
        let voteresult: voteResultObj[] = result.voteresult;
        setVoteRes(voteresult); // 투표 결과 설정
        setWinner(result.winner); // 승리 설정

        setOpenVoteDlg(false); // 투표화면 닫기
        setOpenResDlg(true); // 결과 화면창 열기
        setIsGameStart(false); // 게임 종료 설정
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
        gameStart.current = false;

        // 5초이후에 결과요청 호출
        setTimeout(() => {
          requestResult();
        }, 5000);
      }
    }
  };

  // 게임 결과 요청
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

  // 시작 버튼 클릭 처리
  const handleClickStart = () => {
    if (client !== null) {
      if (!client.connected) return;

      client.publish({
        destination: "/to/liar/start/" + roomId,
        // body: JSON.stringify({
        //   subject: subject,
        // }),
      });
    }
  };

  // 라이브러리 초기화
  const clearObject = () => {
    if (client != null) {
      if (client.connected) client.deactivate();
    }

    if (timer != null) {
      clearInterval(timer);
    }
  };

  const voteNumber = playerCnt - voteCnt;
  return (
    <div className="liar-container tracking-in-expand">
      {isGameStart === false && <p className="liar-title">라이어 게임</p>}
      {nickName === owner && isGameStart === false && (
        <button className="game-start-button" onClick={handleClickStart}>
          START
        </button>
      )}
      {isGameStart === true && (
        <p className={`liar-timeout ${gameTimeSec < 60 ? "liar-red" : ""}`}>
          {gameTimeSec}
        </p>
      )}

      {role === "LIAR" && isGameStart === true && (
        <p className="liar-exp">
          당신은<span className="liar-hero">라이어</span>입니다
        </p>
      )}
      {role !== "LIAR" && isGameStart === true && (
        <div>
          <p className="liar-exp">
            당신은<span className="liar-hero not-liar">플레이어</span>입니다
          </p>
          <p>
            제시어 [<span className="liar-keyword">{keyword}</span>]
          </p>
        </div>
      )}
      {isGameStart === true && role === "LIAR" && (
        <p>
          주제 [<span className="liar-keyword">{subject}</span>]
        </p>
      )}
      {isGameStart === true && (
        <p className="liar-vote">
          남은 투표 수 : <span className="vote-num">{voteNumber}</span>
        </p>
      )}
      {isGameStart === true && (
        <p className="select-liar">
          당신이 선택한 라이어 <span>{selectedValue}</span>
        </p>
      )}
      {isGameStart === true && (
        <div
          className={`liar-vote-button ${isVoted == true ? "liar-red" : ""}`}
          onClick={handleClickVoteOpen}
        >
          투표하기
        </div>
      )}
      <VoteDlg
        open={openVoteDlg}
        onClose={handleVoteClose}
        selectedValue={selectedValue}
        users={userList}
      />
      <LiarResDlg
        open={openResDlg}
        onClose={handleLiarResClose}
        liar={liar}
        voteRes={voteRes}
        winner={winner}
      />
    </div>
  );
};

export default StompLiar;
