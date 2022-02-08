import "./LobbySideBar.css";
import LobbySideBarItem from "./LobbySideBarItem";
export default function LobbySideBar({ items }: any) {
  console.log(items);
  return (
    <>
      <div className="lobby-sidebar-user-container">
        {items.map((item: any) => {
          const { nickname, birthday } = item;

          return (
            <div key={item.id}>
              <LobbySideBarItem item={item} />
            </div>
          );
        })}
      </div>
    </>
  );
}
