import "./LobbySideBarItem.css";
import { useHistory } from "react-router-dom";
export default function LobbySideBarUserListItem({ item }: any) {
  const history = useHistory();

  const routeProfile = () => {
    history.push(`/profile/${item.nickname}`);
  };
  let query;
  if (item.drink.soju !== 0) {
    query = "소주";
  } else if (item.drink.beer !== 0) {
    query = "맥주";
  } else if (item.drink.liquor !== 0) {
    query = "양주";
  }

  return (
    <div className="lobby-sidebar-item-container">
      <div className="lobby-left-img">
        <img src="/images/profile1.jfif" alt="" />
      </div>
      <div className="lobby-left-content">
        <div onClick={routeProfile} className="lobby-profile">
          <span>정보</span>
        </div>
        <h4>{item.nickname}</h4>
        <p>
          주량 : {query} {item.drink.soju} 잔
        </p>
      </div>
    </div>
  );
}
