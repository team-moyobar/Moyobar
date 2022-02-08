import React from 'react';
import StompLiar from '../game/Liar'
import Updown from '../game/Updown';
import { useState } from 'react';
import Button from '@mui/material/Button';

const GameSelect = () => {

  const [gameSelected, setGameSelected] = useState(false)
  const [liar, setLiar] = useState(false)
  const [upDown, setUpDown] = useState(false)

  const handleLiar = () => {
    setLiar(true)
    setGameSelected(true)
  }
  const handleUpDown = () => {
    setUpDown(true)
    setGameSelected(true)
  }
  const handleGameChange = () => {
    setGameSelected(false)
    setUpDown(false)
    setLiar(false)
  }


  return (
    <div>
      {gameSelected == false ? (
        <div>
          <h2>게임을 골라주세요</h2>
          <Button variant="contained" onClick={handleLiar}>라이어게임</Button>
          <Button variant="contained" onClick={handleUpDown}>업다운게임</Button>
        </div>
        ) : null}
      {liar == true ? (
        <div>
          <StompLiar></StompLiar>
          <Button variant="contained" color="error" onClick={handleGameChange}>다른 게임 선택하기</Button>
        </div>
      ) : null } 
      {/* {upDown == true ? (
        <div>
          <Updown></Updown>
          <Button variant="contained" color="error" onClick={handleGameChange}>다른 게임 선택하기</Button>
        </div>
      ) : null }  */}
    </div>
  );
};

export default GameSelect;