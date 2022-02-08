import axios from "axios";
import { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";

import { getToken } from "../../routes/auth/Login";
import { UserInfo } from "../../routes/auth/Profile";

const ProfileUpdateForm = (props: {user : UserInfo}) => {
    const history = useHistory();

    const user = props.user

    const [nickname, setNickname] = useState(user.nickname);
    const [img, setImg] = useState(user.img);

    const onChangeNickname = useCallback(e => {
        setNickname(e.target.value);
    }, []);

    const onChangeImg = useCallback(e => {
        setImg(e.target.value);
    }, []);

    const updateProfile = (e: any) => {
        e.preventDefault();

        const TOKEN = getToken("jwtToken");
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${TOKEN}`,
            },
        }

        const userData = {
            drink: {
                "beer": 1,
                "soju": 100,
                "liquor": 99,
            },
            img: img,
            nickname: nickname
        }

        axios
          .put('/users/info', userData, config)
          .then((res) => {
              console.log("success");
              console.log(res);
              history.push(`${nickname}`);
          })
          .catch((err) => {
              console.log("fail..")
              console.log(err)
          })
    }

    return (
        <div>
            <h1>유저 업데이트 폼</h1>
            <form>
                <label>닉네임 : </label>
                <input type="text" value={nickname} onChange={onChangeNickname} />
                <br />
                <label>프로필 사진 : </label>
                <input type="file" accept="image/png, image/jpeg" value={img} onChange={onChangeImg} />
                <br />
                {/* <label>주량 : </label>
                <select name="" id="">
                    <option value="soju">소주</option>
                    <option value="beer">맥주</option>
                    <option value="liquor">양주</option>
                </select>
                <input type="text" value={user.drink.beer} /> */}
                <button onClick={updateProfile}>정보수정</button>
            </form>
        </div>
    );
}

export default ProfileUpdateForm;