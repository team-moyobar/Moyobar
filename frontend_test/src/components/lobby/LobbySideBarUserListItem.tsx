import React from 'react';
import { Item } from 'react-bootstrap/lib/Breadcrumb';
import "./LobbySideBarUserListItem.css"
import Avatar from '@mui/material/Avatar';

export default function LobbySideBarUserListItem({ item }: any) {

  let query;
  if (item.drink.soju != 0) {
    query = 'drink1' 
  } else if (item.drink.beer != 0){
    query = 'drink2'
  } else if (item.drink.liquor != 0){
    query = 'drink3'
  }

  return (
    <div className='lobby-sidebar-userlist-item' >
      <Avatar  src={`/assets/images/${query}.png`} sx={{display: "inline-block" , height: "1.5rem" , width: "1.5rem", marginLeft: "1rem"}}/>
      <div style={{color: "white" , display: "inline-block", marginLeft: "1rem", fontSize: "1rem", minWidth: "50%"}}>{item.nickname}</div>
      {/* <p style={{color: "white"}}> 생일 : {item.birthday}</p> */}
    </div>
  );
};
;