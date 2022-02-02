import LobbySideBarUserListItem from "./LobbySideBarUserListItem";

export default function LobbySideBarUserList({ items }: any) {
  return (
    <>
      <div>
        {items.map((item: any) => {
          const { nickname, birthday } = item;

          return (
            <div key={item.id}>
              <LobbySideBarUserListItem item = {item} />
            </div>
          )
        })}
      </div>
    </>
  );
}
