import LobbySideBarUserList from "./LobbySideBarUserList";
import "./LobbySideBar.css"

export default function LobbySideBar({ items }: any) {
  return (
    <>
      <div className="lobby-sidebar-header">
        <h1>User</h1>
      </div>
      <LobbySideBarUserList items={items}></LobbySideBarUserList>
    </>
  );
}
