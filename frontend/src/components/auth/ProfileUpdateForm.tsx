

import { UserInfo } from "../../routes/auth/Profile";

const ProfileUpdateForm = (props: {user : UserInfo}) => {

    const user = props.user

    return (
        <div>
            <h1>유저 업데이트 폼</h1>
            <form>
                <label>닉네임 : </label>
                <input type="text" value={user.nickname} />
                <br />
                <label>프로필 사진 : </label>
                <input type="file" accept="image/png, image/jpeg" value={user.img} />
                <br />
                <label>주량 : </label>
                <select name="" id="">
                    <option value="soju">소주</option>
                    <option value="beer">맥주</option>
                    <option value="liquor">양주</option>
                </select>
                <input type="text" value={user.drink.beer} />
                <button>정보수정</button>
            </form>
        </div>
    );
}

export default ProfileUpdateForm;