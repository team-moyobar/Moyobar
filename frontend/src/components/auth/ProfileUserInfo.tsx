import { UserInfo } from "../../routes/auth/Profile";
import TextField from '@mui/material/TextField';
import "./ProfileUserInfo.css"


const ProfileUserInfo = (props: { user : UserInfo }) => {

  const user = props.user
  let query;
  if (user.drink.soju !== 0) {
    query = "소주";
  } else if (user.drink.beer !== 0) {
    query = "맥주";
  } else if (user.drink.liquor !== 0) {
    query = "양주";
  }
  console.log(user.img)
  
  return (
    <div className="profile-userinfo-contents">
      <div className="profile-picture">
        <div className="profile-picture-img">
          {/* <img src="/images/profile1.jfif" alt="" /> */}
          <img src="https://pds.joins.com/news/component/htmlphoto_mmdata/202105/17/cf5ac1a6-edd6-4f56-9375-4e208c02a7a5.jpg" alt="" />
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
        <span className="profile-item-title">주량</span>
        <span>{query} {user.drink.soju} 잔</span>
      </div>
      {/* <p>1. {user.user_id}</p>
      <p>4. {user.img}</p>
      <p>5. {user.score}</p>
      <p>6. {user.drink.beer}</p> */}
    </div>
  )
};

export default ProfileUserInfo;