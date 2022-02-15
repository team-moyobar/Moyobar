import { UserInfo } from "../../routes/auth/Profile";
import TextField from "@mui/material/TextField";
import "./ProfileUserInfo.css";

const ProfileUserInfo = (props: { user: UserInfo }) => {
  const user = props.user;
  let query;
  if (user.drink.soju !== 0) {
    query = "소주";
  } else if (user.drink.beer !== 0) {
    query = "맥주";
  } else if (user.drink.liquor !== 0) {
    query = "양주";
  }
  console.log(user.img);

  return (
    <div className="profile-userinfo-contents">
      <div className="profile-picture">
        <div className="profile-picture-img">
          <img
            src={user.img}
            alt=""
          />
        </div>
      </div>
      <div className="profile-item">
        <span className="profile-item-title">닉네임</span>
        <span>{user.nickname}</span>
      </div>
      <div className="profile-item">
        <span className="profile-item-title">생년월일</span>
        <span>{user.birthday}</span>
      </div>
      <div className="profile-item">
        <span className="profile-item-title">자기소개</span>
        <span>{user.description}</span>
      </div>
      <div className="profile-item">
        <span className="profile-item-title">주량</span>
        <span>
          {query} {user.drink.soju} 잔
        </span>
      </div>
    </div>
  );
};

export default ProfileUserInfo;
