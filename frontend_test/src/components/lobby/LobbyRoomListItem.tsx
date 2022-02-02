import React from "react";

//모달창 부분1
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

//모달창 부분-1

export default function LobbyRoomListItem({ item }: any) {
  let query = item.room_id%5 + 1;

  //모달창 부분2
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  //모달창 부분-2

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(20, 20, 20, 0) 10%,
        rgba(20, 20, 20, 0.25) 25%,
        rgba(20, 20, 20, 0.5) 50%,
        rgba(20, 20, 20, 0.75) 75%,
        rgba(20, 20, 20, 1) 100%
      ), url(/assets/images/thema${query}.png)`,
        backgroundSize: "cover",
        height: "200px",
        color: "white",
        paddingTop: "1rem",
      }}
    >
      <Button onClick={handleOpen} variant="contained" color="secondary">방 입장</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Title : {item.title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Owner : {item.owner}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {item.description}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
            <Button>입장하기</Button>
          </Box>
        </Box>
      </Modal>
      <p style={{ margin: "0" }}>방이름 : {item.title}</p>
      <p style={{ margin: "0" }}>인원 : {item.participants.length}/{item.max}</p>
      <p>{item.type}</p>
    </div>
  );
}
