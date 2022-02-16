import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import { blue } from "@mui/material/colors";
import "./VoteDlg.css";

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  users: string[];
  onClose: (value: string) => void;
}

export function VoteDlg(props: SimpleDialogProps) {
  const { onClose, selectedValue, open, users } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{
        style: {
          backgroundColor: "grey",
          minWidth: "40vh",
          maxWidth: "40vh",
          minHeight: "60vh",
          maxHeight: "60vh",
        },
      }}
    >
      <div className="vote-container">
        <h2>라이어를 선택해주세요</h2>
        <List sx={{ pt: 0 }}>
          {users.map((email) => (
            <ListItem
              button
              onClick={() => handleListItemClick(email)}
              key={email}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={email} />
            </ListItem>
          ))}
        </List>
      </div>
    </Dialog>
  );
}
