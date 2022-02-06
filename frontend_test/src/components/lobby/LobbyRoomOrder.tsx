import React from 'react';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function LobbyRoomOrder({onClick}: any) {
  const handleClick = () => {
    onClick({searchBy : 'null', keyword : 'null'  })
  }

  return (
    <div style={{display: "inline"}}>
      <ThemeProvider theme={darkTheme}>
      <Button color="secondary"variant='outlined' onClick={handleClick}>방 새로고침</Button>
      </ThemeProvider>
    </div>
  );
};

