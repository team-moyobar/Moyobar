import "./LobbySideBarItem.css";

export default function LobbySideBarUserListItem({ item }: any) {
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
        <div className="lobby-profile">
          <span>정보</span>
        </div>
        <h4>{item.nickname}</h4>
        <p>{query} {item.drink.soju}</p>
      </div>
    </div>
  );
}
