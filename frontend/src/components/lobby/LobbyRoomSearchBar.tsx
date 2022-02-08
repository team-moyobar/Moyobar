import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export default function LobbyRoomSearchBar({ onSubmit }: any) {
  const [searchBy, setSearchBy] = React.useState("all");
  const [keyword, setKeyword] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSearchBy(event.target.value as string);
    console.log(searchBy);
  };
  const keywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setKeyword(value);
    console.log(keyword);
  };
  const handleSubmit = () => {
    onSubmit({ searchBy, keyword });
  };

  return (
    <Box sx={{ width: 400, display: "inline-block" }}>
      <FormControl size="small" sx={{ width: 100 }}>
        <InputLabel id="demo-simple-select-label">카테고리</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={searchBy}
          label="searchBy"
          onChange={handleChange}
        >
          <MenuItem value={"all"}>전체</MenuItem>
          <MenuItem value={"title"}>제목</MenuItem>
          <MenuItem value={"owner"}>방장</MenuItem>
          <MenuItem value={"description"}>방소개</MenuItem>
        </Select>
      </FormControl>
      <TextField
        id="outlined-basic"
        label="검색어"
        variant="outlined"
        size="small"
        name="keyword"
        onChange={keywordChange}
      />
      <Button
        variant="outlined"
        sx={{ height: 40 }}
        color="primary"
        onClick={handleSubmit}
      >
        검색
      </Button>
    </Box>
  );
}
