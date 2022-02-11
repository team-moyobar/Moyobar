import axios from "axios";
import { OpenVidu } from "openvidu-browser";
import React, { Component } from "react";
import "./UserCamera.css";
import UserVideoComponent from "./UserVideoComponent";
import Button from "@mui/material/Button";
import Messages from "./Messages";
import GameSelect from "./GameSelect";

import { getToken as getCookie } from "../../routes/auth/Login";
import { withRouter } from "react-router-dom";
import { NoEncryption } from "@mui/icons-material";

const OPENVIDU_SERVER_URL = "https://i6d210.p.ssafy.io:4443";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";
const TOKEN = getCookie("jwtToken");

class UserCamera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mySessionId: props.roomId,
      myUserName: getCookie("nickname"),
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
      subscribers: [],
      messages: [],
      isGameSelectButtonClicked: false,

      audiostate: false,
      videostate: false,

      gameSelect: "None",
    };

    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);

    this.chattoggle = this.chattoggle.bind(this);
    this.sendmessageByClick = this.sendmessageByClick.bind(this);
    this.sendmessageByEnter = this.sendmessageByEnter.bind(this);
    this.handleChatMessageChange = this.handleChatMessageChange.bind(this);
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.onbeforeunload);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onbeforeunload);
  }

  onbeforeunload(event) {
    this.leaveSession();
  }

  handleChangeSessionId(e) {
    this.setState({
      mySessionId: e.target.value,
    });
  }

  handleChangeUserName(e) {
    this.setState({
      myUserName: e.target.value,
    });
  }

  handleMainVideoStream(stream) {
    if (this.state.mainStreamManager !== stream) {
      this.setState({
        mainStreamManager: stream,
      });
    }
  }

  deleteSubscriber(streamManager) {
    let subscribers = this.state.subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      this.setState({
        subscribers: subscribers,
      });
    }
  }

  sendmessageByClick() {
    this.setState({
      messages: [
        ...this.state.messages,
        {
          userName: this.state.myUserName,
          text: this.state.message,
          chatClass: "messages__item--operator",
        },
      ],
    });
    const mySession = this.state.session;

    mySession.signal({
      data: `${this.state.myUserName},${this.state.message}`,
      to: [],
      type: "chat",
    });

    this.setState({
      message: "",
    });
  }

  sendmessageByEnter(e) {
    if (e.key === "Enter") {
      this.setState({
        messages: [
          ...this.state.messages,
          {
            userName: this.state.myUserName,
            text: this.state.message,
            chatClass: "messages__item--operator",
          },
        ],
      });
      const mySession = this.state.session;

      mySession.signal({
        data: `${this.state.myUserName},${this.state.message}`,
        to: [],
        type: "chat",
      });

      this.setState({
        message: "",
      });
    }
  }

  handleChatMessageChange(e) {
    this.setState({
      message: e.target.value,
    });
  }

  chattoggle() {
    this.setState({ chaton: !this.state.chaton });
  }

  joinSession() {
    // --- 1) Get an OpenVidu object ---

    this.OV = new OpenVidu();

    // --- 2) Init a session ---

    this.setState(
      {
        session: this.OV.initSession(),
      },
      () => {
        var mySession = this.state.session;

        // --- 3) Specify the actions when events take place in the session ---

        // On every new Stream received...
        mySession.on("streamCreated", (event) => {
          // Subscribe to the Stream to receive it. Second parameter is undefined
          // so OpenVidu doesn't create an HTML video by its own
          var subscriber = mySession.subscribe(event.stream, undefined);
          var subscribers = this.state.subscribers;
          subscribers.push(subscriber);

          // Update the state with the new subscribers
          this.setState({
            subscribers: subscribers,
          });
        });

        mySession.on("signal:chat", (event) => {
          let chatdata = event.data.split(",");
          if (chatdata[0] !== this.state.myUserName) {
            this.setState({
              messages: [
                ...this.state.messages,
                {
                  userName: chatdata[0],
                  text: chatdata[1],
                  chatClass: "messages__item--visitor",
                },
              ],
            });
          }
        });

        mySession.on("signal:selgame", (event) => {
          this.setState({
            gameSelect: event.data,
          });
        });

        // On every Stream destroyed...
        mySession.on("streamDestroyed", (event) => {
          // Remove the stream from 'subscribers' array
          this.deleteSubscriber(event.stream.streamManager);
        });

        // On every asynchronous exception...
        mySession.on("exception", (exception) => {
          console.warn(exception);
        });

        // --- 4) Connect to the session with a valid user token ---

        // 'getToken' method is simulating what your server-side should do.
        // 'token' parameter should be retrieved and returned by your own backend
        this.getToken().then((token) => {
          // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
          // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
          mySession
            .connect(token, { clientData: this.state.myUserName })
            .then(() => {
              // --- 5) Get your own camera stream ---

              // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
              // element: we will manage it on our own) and with the desired properties
              let publisher = this.OV.initPublisher(undefined, {
                audioSource: undefined, // The source of audio. If undefined default microphone
                videoSource: undefined, // The source of video. If undefined default webcam
                publishAudio: false, // Whether you want to start publishing with your audio unmuted or not
                publishVideo: false, // Whether you want to start publishing with your video enabled or not
                resolution: "640x480", // The resolution of your video
                frameRate: 30, // The frame rate of your video
                insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
                mirror: false, // Whether to mirror your local video or not
              });

              // --- 6) Publish your stream ---

              mySession.publish(publisher);

              // Set the main video in the page to display our webcam and store our Publisher
              this.setState({
                mainStreamManager: publisher,
                publisher: publisher,
              });
            })
            .catch((error) => {
              console.log(
                "There was an error connecting to the session:",
                error.code,
                error.message
              );
            });
        });
      }
    );
  }

  leaveSession() {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

    const mySession = this.state.session;

    if (mySession) {
      mySession.disconnect();
    }

    // Empty all properties...
    this.OV = null;
    this.setState({
      session: undefined,
      subscribers: [],
      mySessionId: "SessionA",
      myUserName: "Participant" + Math.floor(Math.random() * 100),
      mainStreamManager: undefined,
      publisher: undefined,
    });
    // this.props.history.push('/lobby');

    axios
      .delete(`/rooms/${this.state.mySessionId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      })
      .then((res) => {
        console.log("success");
        console.log(res);
      })
      .catch((err) => {
        console.log("Fail..");
        console.log(err);
      });
    this.props.history.push("/lobby");
  }

  componentDidMount() {
    this.joinSession();
  }

  handleGameSelectButton() {
    if (this.state.isGameSelectButtonClicked == false) {
      this.setState({
        isGameSelectButtonClicked: true,
      });
    } else {
      this.setState({
        isGameSelectButtonClicked: false,
      });
    }
  }

  render() {
    const mySessionId = this.state.mySessionId;
    const myUserName = this.state.myUserName;

    const messages = this.state.messages;

    const { history } = this.props;

    let query;

    switch (this.state.subscribers.length) {
      case 0:
        query = 1;
        break;
      case 1:
        query = 2;
        break;
      case 2:
        query = 3;
        break;
      case 3:
        query = 3;
        break;
      case 4:
        query = 4;
        break;
      case 5:
        query = 4;
        break;
      case 6:
        query = 5;
        break;
      case 7:
        query = 5;
        break;
      default:
    }

    console.log(query);
    return (
      <div className="room-container">
        {this.state.session !== undefined ? (
          <div className="session">
            <div className="session-header">
              <p>{mySessionId}번 방제목 필요합니다</p>
            </div>
            <div className="video-container">
              {this.state.publisher !== undefined ? (
                <div
                  className={`stream-container${query}`}
                  onClick={() =>
                    this.handleMainVideoStream(this.state.publisher)
                  }
                >
                  <UserVideoComponent streamManager={this.state.publisher} />
                </div>
              ) : null}
              {this.state.subscribers.map((sub, i) => (
                <div
                  key={i}
                  className={`stream-container${query}`}
                  onClick={() => this.handleMainVideoStream(sub)}
                >
                  <UserVideoComponent streamManager={sub} />
                </div>
              ))}
            </div>
            <div className="session-footer">
              <button
                onClick={() => {
                  this.state.publisher.publishAudio(!this.state.audiostate);
                  this.setState({ audiostate: !this.state.audiostate });
                }}
              >
                <img src="/icons/room/mic.png" alt=""></img>
              </button>
              <button
                onClick={() => {
                  this.state.publisher.publishVideo(!this.state.videostate);
                  this.setState({ videostate: !this.state.videostate });
                }}
              >
                <img src="/icons/room/camera.png" alt=""></img>
              </button>
              <button onClick={() => this.handleGameSelectButton()}>
                {this.state.isGameSelectButtonClicked !== false
                  ? "게임 종료"
                  : "게임 선택"}
              </button>
            </div>
          </div>
        ) : null}
        <div className="gamebox">
          <div className="gamebox-top"></div>
          <div className="gamebox-center">
            {/* {this.state.isGameSelectButtonClicked !== false ? ( */}
            <GameSelect
              mySession={this.state.session}
              receiveGameSelect={this.state.gameSelect}
            ></GameSelect>
            {/* ) : null} */}
          </div>
          <div className="gamebox-bottom">
            <button onClick={this.leaveSession}>
              <img className="exit-button" src="/icons/room/exit.png" alt="">나가기</img>
            </button>
          </div>
        </div>
        <div className="chatbox">
          {this.state.chaton ? (
            <div className="chat chatbox__support chatbox--active">
              <div className="chat chatbox__header" />
              <div className="chatbox__messages" ref="chatoutput">
                {/* {this.displayElements} */}
                <Messages messages={messages} />
                <div />
              </div>
              <div className="chat chatbox__footer">
                <input
                  id="chat_message"
                  type="text"
                  placeholder="메시지를 입력하세요"
                  onChange={this.handleChatMessageChange}
                  onKeyPress={this.sendmessageByEnter}
                  value={this.state.message}
                />
                <p
                  className="chat chatbox__send--footer"
                  onClick={this.sendmessageByClick}
                >
                  보내기
                </p>
              </div>
            </div>
          ) : null}
          <div className="chatbox__button" ref={this.chatButton}>
            <button onClick={this.chattoggle}>● ● ●</button>
          </div>
        </div>
      </div>
    );
  }

  /**
   * --------------------------
   * SERVER-SIDE RESPONSIBILITY
   * --------------------------
   * These methods retrieve the mandatory user token from OpenVidu Server.
   * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
   * the API REST, openvidu-java-client or openvidu-node-client):
   *   1) Initialize a Session in OpenVidu Server	(POST /openvidu/api/sessions)
   *   2) Create a Connection in OpenVidu Server (POST /openvidu/api/sessions/<SESSION_ID>/connection)
   *   3) The Connection.token must be consumed in Session.connect() method
   */

  getToken() {
    return this.createSession(this.state.mySessionId).then((sessionId) =>
      this.createToken(sessionId)
    );
  }

  createSession(sessionId) {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({ customSessionId: sessionId });
      axios
        .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions", data, {
          headers: {
            Authorization:
              "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("CREATE SESION", response);
          resolve(response.data.id);
        })
        .catch((response) => {
          var error = Object.assign({}, response);
          if (error?.response?.status === 409) {
            resolve(sessionId);
          } else {
            console.log(error);
            console.warn(
              "No connection to OpenVidu Server. This may be a certificate error at " +
                OPENVIDU_SERVER_URL
            );
            if (
              window.confirm(
                'No connection to OpenVidu Server. This may be a certificate error at "' +
                  OPENVIDU_SERVER_URL +
                  '"\n\nClick OK to navigate and accept it. ' +
                  'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                  OPENVIDU_SERVER_URL +
                  '"'
              )
            ) {
              window.location.assign(
                OPENVIDU_SERVER_URL + "/accept-certificate"
              );
            }
          }
        });
    });
  }

  createToken(sessionId) {
    return new Promise((resolve, reject) => {
      var data = {};
      axios
        .post(
          OPENVIDU_SERVER_URL +
            "/openvidu/api/sessions/" +
            sessionId +
            "/connection",
          data,
          {
            headers: {
              Authorization:
                "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("TOKEN", response);
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  }
}

export default withRouter(UserCamera);
