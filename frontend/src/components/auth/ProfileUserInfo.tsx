import { UserInfo } from "../../routes/auth/Profile";
import "./ProfileUserInfo.css";

const ProfileUserInfo = (props: { user: UserInfo }) => {
  const user = props.user;
  let query;
  let howMany;
  if (user.drink.soju !== 0) {
    query = "소주";
    howMany = `${user.drink.soju}병`;
  } else if (user.drink.beer !== 0) {
    query = "맥주";
    howMany = `${user.drink.beer}캔`;
  } else if (user.drink.liquor !== 0) {
    query = "양주";
    howMany = `${user.drink.liquor}잔`;
  }

  return (
    <div className="profile-userinfo-contents">
      <div
        className="profile-picture"
        style={{ backgroundImage: `url(${user.img})` }}
      ></div>
      <div className="profile-item profile-top">
        <span className="profile-item-title">닉네임</span>
        <span>{user.nickname}</span>
      </div>
      <div className="profile-item">
        <span className="profile-item-title">생년월일</span>
        <span>{user.birthday}</span>
      </div>
      <div className="profile-item">
        <span className="profile-item-title">자기소개</span>
        <div className="profile-expself">{user.description}</div>
      </div>
      <div className="profile-item">
        <span className="profile-item-title">주량</span>
        {query === "소주" && (
          <p className="profile-soju">
            {query}
            <span className="profile-basic">{howMany}</span>
          </p>
        )}
        {query === "맥주" && (
          <p className="profile-beer">
            {query}
            <span className="profile-basic">{howMany}</span>
          </p>
        )}
        {query === "양주" && (
          <p className="profile-liquor">
            {query}
            <span className="profile-basic">{howMany}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileUserInfo;
