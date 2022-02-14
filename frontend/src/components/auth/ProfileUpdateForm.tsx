import axios from "axios";
import { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";

import { getToken } from "../../routes/auth/Login";
import { UserInfo } from "../../routes/auth/Profile";
import Cookies from "universal-cookie";
import { useDispatch } from "react-redux";
import { loginCheck } from "../../redux/auth/action";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import React from "react";
import ReactDOM from "react-dom";

import "./ProfileUpdateForm.css";

const ProfileUpdateForm = (props: { user: UserInfo }) => {
  const dispatch = useDispatch();
  const cookies = new Cookies();

  const setCookieNickname = (nickname: string) => {
    cookies.set("nickname", nickname, {
      path: "/",
    });
  };

  const history = useHistory();

  const user = props.user;

  let prevDrink 
  let prevDrinkCnt
  if (user.drink.beer != 0) {
    prevDrink = 'beer'
    prevDrinkCnt = user.drink.beer
  }else if (user.drink.soju != 0) {
    prevDrink = 'soju'
    prevDrinkCnt = user.drink.soju
  }else {
    prevDrink = 'liquor'
    prevDrinkCnt = user.drink.liquor
  }

  const [nickname, setNickname] = useState(user.nickname);
  const [img, setImg] = useState(user.img);
  const [drink, setDrink] = useState(prevDrink)
  const [drinkCnt, setDrinkCnt] = useState(prevDrinkCnt)
  const [description, setDescription] = useState(user.description)

  const onChangeNickname = useCallback((e) => {
    setNickname(e.target.value);
  }, []);

  const onChangeImg = useCallback((e) => {
    setImg(e.target.files[0]);
    // setImg(e.target.value);
    console.log(e.target.value);
    console.log(e.target.files[0])
    
  }, []);

  const onChangeDrink = useCallback((e) => {
    setDrink(e.target.value);
  }, []);

  const onChangeDrinkCnt = useCallback((e) => {
    setDrinkCnt(e.target.value);
  }, []);

  const onChangeDescription = useCallback((e) => {
    setDescription(e.target.value);
  }, []);

  const updateProfile = (e: any) => {
    e.preventDefault();
    let drinkData
    switch (drink) {
      case 'beer':
        drinkData = {
          "beer" : Number(drinkCnt),
          "soju" : 0,
          "liquor" : 0,
        }
        break
      case 'soju':
        drinkData = {
          "beer" : 0,
          "soju" : Number(drinkCnt),
          "liquor" : 0,
        }
        break
      case 'liquor':
        drinkData = {
          "beer" : 0,
          "soju" : 0,
          "liquor" : Number(drinkCnt),
        }
        break
    }

    const TOKEN = getToken("jwtToken");
    const config = {
      headers: {
        "Content-Type": `multipart/form-data`,
        Authorization: `Bearer ${TOKEN}`,
      },
    };

    const userData = {
      drink: drinkData,
      // img: img,
      nickname: nickname,
      description: description,
    };

    // axios
    //   .put("/users/info", userData, config)
    //   .then((res) => {
    //     console.log("success");
    //     console.log(res);
    //     setCookieNickname(userData.nickname);
    //     dispatch(loginCheck(userData.nickname));
    //     alert("회원정보가 수정되었습니다.");
    //     history.push(`${nickname}`);
    //   })
    //   .catch((err) => {
    //     console.log("fail..");
    //     console.log(err);
    //   });

    const frm = new FormData()
    // frm.append('drink', drinkData)
    frm.append('img', img)
    frm.append('update_info', new Blob([JSON.stringify(userData)], {type: "application/json"}))

    console.log(frm)

    axios
      .put("/users/info", frm, config)
      .then((res) => {
        console.log("success");
        console.log(res);
        setCookieNickname(userData.nickname);
        dispatch(loginCheck(userData.nickname));
        alert("회원정보가 수정되었습니다.");
        history.push(`${nickname}`);
      })
      .catch((err) => {
        console.log("fail..");
        console.log(err);
      });

    console.log(userData);
  };

  return (
    <div className="profile-update-content">
      <div>
        <h1>회원정보를 변경해주세요</h1>
      </div>
      <form className="profile-update-form-contents">
        <div>
          <TextField
            id="outlined-basic"
            label="닉네임 변경"
            variant="outlined"
            value={nickname}
            onChange={onChangeNickname}
            sx={{width: 1/4}}
          />
        </div>
        <div>
          <TextField
            id="outlined-textarea"
            label="자기소개를 입력해주세요"
            // placeholder="Placeholder"
            rows={3}
            multiline
            value={description}
            sx={{width: 1/2}}
            onChange={onChangeDescription}
          />
        </div>
        <div>
          <TextField
            type="file"
            label="프로필 사진"
            inputProps={{ accept: "image/png, image/jpeg, image/jpg" }}
            onChange={onChangeImg}
            sx={{width: 1/3}}
            InputProps={{
              startAdornment: <InputAdornment position="start"></InputAdornment>,
            }}
            // defaultValue="파일을 선택해주세요"
          />
        </div>
        <div>
          {/* <label>주량 : </label>
                  <select name="" id="">
                      <option value="soju">소주</option>
                      <option value="beer">맥주</option>
                      <option value="liquor">양주</option>
                  </select>
                  <input type="text" value={user.drink.beer} /> */}
          <FormControl>
            <InputLabel id="demo-simple-select-label">주종</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={drink}
              label="drink"
              onChange={onChangeDrink}
            >
              <MenuItem value={'beer'}>맥주</MenuItem>
              <MenuItem value={'soju'}>소주</MenuItem>
              <MenuItem value={'liquor'}>양주</MenuItem>
            </Select>
          </FormControl>
          <TextField
            id="outlined-basic"
            label="주량"
            variant="outlined"
            value={drinkCnt}
            onChange={onChangeDrinkCnt}
            sx={{width: 1/4}}
          />
        </div>
        <div>
          <Button variant="outlined" onClick={updateProfile} size="large">
            수정하기
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileUpdateForm;
