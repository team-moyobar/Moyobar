import "./LobbySideBarItem.css";
import { useHistory } from "react-router-dom";
export default function LobbySideBarUserListItem({ item }: any) {
  const history = useHistory();

  const routeProfile = () => {
    history.push(`/profile/${item.nickname}`);
  };
  let query;
  let howMany;
  if (item.drink.soju !== 0) {
    query = "소주";
    howMany = `${item.drink.soju}병`;
  } else if (item.drink.beer !== 0) {
    query = "맥주";
    howMany = `${item.drink.beer}캔`;
  } else if (item.drink.liquor !== 0) {
    query = "양주";
    howMany = `${item.drink.liquor}잔`;
  }

  return (
    <div onClick={routeProfile} className="lobby-sidebar-item-container">
      <div className="lobby-left-img">
        <img src={item.img} alt="" />
      </div>
      <div className="lobby-left-content">
        <div className="lobby-profile">
          <img src="/icons/lobby/lobbyprofile.png" alt="" />
        </div>
        <h4>{item.nickname}</h4>
        {/* 여기에 이모티콘 추가 */}
        <p>
          주량 : {query} {howMany}
        </p>
      </div>
    </div>
  );
}
