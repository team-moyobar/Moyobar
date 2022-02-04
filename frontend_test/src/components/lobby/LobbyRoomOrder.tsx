import React from 'react';
import Button from '@mui/material/Button';

export default function LobbyRoomOrder({onClick}: any) {
  const handleClick = () => {
    onClick({searchBy : 'null', keyword : 'null'  })
  }

  return (
    <div>
      <Button color="secondary"variant='contained' onClick={handleClick}>최신순</Button>
    </div>
  );
};

