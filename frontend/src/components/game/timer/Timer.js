import React, { useState } from "react";

import { CountdownCircleTimer } from "react-countdown-circle-timer";

import "./Timer.css";

const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return <div className="timer">Too lale...</div>;
  }

  return (
    <div className="timer">
      <div className="text">Remaining</div>
      <div className="value">{remainingTime}</div>
      <div className="text">seconds</div>
    </div>
  );
};

function Timer() {
  const [key, setKey] = useState(0);
  const [duration, setDuration] = useState(10);

  return (
    <div className="App">
      <div className="timer-wrapper">
        <CountdownCircleTimer
          key={key}
          isPlaying
          duration={duration}
          colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
          onComplete={() => {
            setKey((prevKey) => prevKey + 1);
          }}
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>
    </div>
  );
}

export default Timer;