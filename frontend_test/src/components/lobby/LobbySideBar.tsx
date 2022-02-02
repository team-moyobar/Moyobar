import LobbySideBarUserList from "./LobbySideBarUserList";

export default function LobbySideBar({ items }: any) {
  return (
    <>
      <h3>유저목록</h3>
      <LobbySideBarUserList items={items}></LobbySideBarUserList>
    </>
  );
}
