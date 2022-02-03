import React, { useRef } from "react";
import SockJsClient from "react-stomp";

function App() {
  const websocket = useRef(null);

  const handleMsg = (msg) => {
    console.log(msg);
  };

  const handleClickSendTo = () => {
    websocket.current.sendMessage("/app/liar/1", "Hello Stomp!!");
  };

  const handleClickSendTemplate = () => {
    websocket.current.sendMessage("/Template");
  };

  const handleOnConnect = () => {
    console.log("connected!!");
  };

  return (
    <div>
      <SockJsClient
        url="http://localhost:8080/ws"
        // url="http://i6d210.p.ssafy.io:8080/ws"
        topics={["/topic/liar"]}
        onConnect={handleOnConnect}
        onMessage={(msg) => {
          handleMsg(msg);
        }}
        ref={websocket}
      />
      <button onClick={handleClickSendTo}>SendTo</button>{" "}
      <button onClick={handleClickSendTemplate}>SendTemplate</button>{" "}
    </div>
  );
}
export default App;
