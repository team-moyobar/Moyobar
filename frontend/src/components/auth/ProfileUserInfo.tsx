import { UserInfo } from "../../routes/auth/Profile";


const ProfileUserInfo = (props: { user : UserInfo }) => {

  const user = props.user
  
  return (
    <div>
      <h1>프로필</h1>
      <p>1. {user.user_id}</p>
      <p>2. {user.nickname}</p>
      <p>3. {user.birthday}</p>
      <p>4. {user.img}</p>
      <p>5. {user.score}</p>
      <p>6. {user.drink.beer}</p>
    </div>
  )
};

export default ProfileUserInfo;