import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { useParams } from "react-router";

import { getToken } from "../../routes/auth/Login";
import { VoteDlg } from "./VoteDlg";
import { LiarResDlg } from "./LiarResDlg";

import "./Liar.css";

var client: Client | null = null;

var timer: NodeJS.Timer | null = null;

export interface gameStartObj {
  subject: string;
  rolekeyword: gameDataObj[];
}

export interface gameDataObj {
  nickname: string;
  roletype: string;
  keyword: string;
}

export interface gameResultObj {
  liar: string;
  voteresult: voteResultObj[];
  winner: string;
}

export interface voteResultObj {
  nickname: string;
  votecnt: string;
}

const StompLiar = () => {
  const nickName = getToken("nickname");
  const { roomId } = useParams<{ roomId?: string }>();
  const { owner } = useParams<{ owner?: string }>();

  const gameTime = useRef(180);
  const gameStart = useRef(false);
  const voteUser = useRef("");
  const playerCntRef = useRef(0);

  const [gameTimeSec, setGameTimeSec] = useState(180);
  const [userList, setUserList] = React.useState([""]);
  const [subject, setSubject] = React.useState("동물");
  const [role, setRole] = useState("");
  const [keyword, setKeyword] = useState("");

  const [openVoteDlg, setOpenVoteDlg] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("");
  const [openResDlg, setOpenResDlg] = React.useState(false);

  const [isGameStart, setIsGameStart] = React.useState(false);
  const [isVoted, setIsVoted] = React.useState(false);

  const [liar, setLiar] = React.useState("");
  const [voteCnt, setVoteCnt] = React.useState(0);
  const [playerCnt, setPlayerCnt] = React.useState(0);
  const [voteRes, setVoteRes] = React.useState<voteResultObj[]>([]);
  const [winner, setWinner] = React.useState("");

  const handleClickVoteOpen = () => {
    if (isVoted === false) {
      setOpenVoteDlg(true);
    }
  };

  const handleVoteClose = (value: string) => {
    setOpenVoteDlg(false);

    if (value !== "") {
      setSelectedValue(value);
      voteUser.current = value;
      setIsVoted(true);

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

  const handleLiarResClose = () => {
    setOpenResDlg(false);
  };

  const subScribeStart = () => {
    if (client !== null) {
      client.subscribe("/from/liar/start/" + roomId, (data: any) => {
        let result: gameStartObj = JSON.parse(data.body);
        setSubject(result.subject);

        let obj: gameDataObj[] = result.rolekeyword;

        let userList: string[] = [];

        for (let i = 0; i < obj.length; i++) {
          if (obj[i].nickname === nickName) {
            setRole(obj[i].roletype);
            setKeyword(obj[i].keyword);
          } else {
            userList.push(obj[i].nickname);
          }
        }

        playerCntRef.current = obj.length;
        setPlayerCnt(playerCntRef.current);

        setIsVoted(false);
        setVoteCnt(0);
        setUserList(userList);
        setSelectedValue("");

        gameStart.current = true;
        gameTime.current = 180;

        setOpenVoteDlg(false);
        setOpenResDlg(false);

        setIsGameStart(true);
      });
    }
  };

  const subScribeVote = () => {
    if (client !== null) {
      client.subscribe("/from/liar/vote/" + roomId, (data: any) => {
        let votecnt: number = JSON.parse(data.body).votecnt;

        setVoteCnt(votecnt);
        if (votecnt === playerCntRef.current) {
          gameStart.current = false;
          setTimeout(() => {
            requestResult();
          }, 5000);
        }
      });
    }
  };

  const subScribeResult = () => {
    if (client !== null) {
      client.subscribe("/from/liar/result/" + roomId, (data: any) => {
        let result: gameResultObj = JSON.parse(data.body);

        setLiar(result.liar);
        let voteresult: voteResultObj[] = result.voteresult;
        setVoteRes(voteresult);
        setWinner(result.winner);

        setOpenVoteDlg(false);
        setOpenResDlg(true);
        setIsGameStart(false);
      });
    }
  };

  useEffect(() => {
    connect();
    timer = setInterval(() => {
      processGame();
    }, 1000);
    return () => clearObject();
  }, []);

  const processGame = () => {
    if (gameStart.current === true) {
      gameTime.current--;

      setGameTimeSec(gameTime.current);

      if (gameTime.current <= 0 && client != null) {
        gameStart.current = false;

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
      brokerURL: "wss://i6d210.p.ssafy.io/moyobar/websocket",
      reconnectDelay: 10000,
      onConnect: () => {
        subScribeStart();
        subScribeVote();
        subScribeResult();
      },
    });

    client.activate();
  };

  const handleClickStart = () => {
    if (client !== null) {
      if (!client.connected) return;

      client.publish({
        destination: "/to/liar/start/" + roomId,
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
