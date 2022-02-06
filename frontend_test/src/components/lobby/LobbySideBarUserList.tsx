import LobbySideBarUserListItem from "./LobbySideBarUserListItem";
import "./LobbySideBarUserList.css"

export default function LobbySideBarUserList({ items }: any) {
  return (
    <>
      <div className="lobby-sidebar-user-container">
        {items.map((item: any) => {
          const { nickname, birthday } = item;

          return (
            <div key={item.id} >
              <LobbySideBarUserListItem item = {item} />
            </div>
          )
        })}
      </div>
    </>
  );
}
