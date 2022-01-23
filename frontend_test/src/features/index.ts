import {
  combineReducers,
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import { generate as generateRandomStr } from "randomstring";

export interface Room {
  id: string;
  title: string;
  start: boolean;
}
export interface RoomList {
  list: Room[];
}
const initialState: RoomList = {
  list: [],
};

const actionPrefix = "ROOMS";
const addRooms = createAction<object>(`${actionPrefix}/add`);
const reducers = {
  add: (
    { list }: RoomList,
    { payload: { title, start } }: PayloadAction<Room>
  ) => {
    const newRoom: Room = {
      id: generateRandomStr(5),
      title: title.toString(),
      start,
    };
    list.push(newRoom);
  },
};
const roomSlice = createSlice({
  reducers,
  initialState,
  name: actionPrefix,
});
export const selectRoomList = createSelector(
  (state: RoomList) => state.list,
  (list: Room[]) => list
);
export const actions = {
  addRooms,
};
export const rootReducer = combineReducers({
  rooms: roomSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
