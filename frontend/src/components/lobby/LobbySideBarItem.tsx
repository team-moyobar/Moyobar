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
    <div onClick={routeProfile} className="lobby-sidebar-item-container">
      <div className="lobby-left-img">
        <img
          src="https://pds.joins.com/news/component/htmlphoto_mmdata/202105/17/cf5ac1a6-edd6-4f56-9375-4e208c02a7a5.jpg"
          alt=""
        />
      </div>
      <div className="lobby-left-content">
        <div className="lobby-profile">
          <img src="/icons/lobby/lobbyprofile.png" alt="" />
        </div>
        <h4>{item.nickname}</h4>
        <p>
          주량 : {query} {item.drink.soju} 잔
        </p>
      </div>
    </div>
  );
}
