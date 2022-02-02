import React from 'react';
import { Item } from 'react-bootstrap/lib/Breadcrumb';

export default function LobbySideBarUserListItem({ item }: any) {
  return (
    <div>
      <p> 닉네임 : {item.nickname}</p>
      <p> 생일 : {item.birthday}</p>
    </div>
  );
};
;