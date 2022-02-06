import { LOGINCHECK, LOGOUTCHECK } from "./actions";

const initialStore = {
  isLogin: "로그아웃",
  nickname: "바보",
};

const authReducer = (state = initialStore, action: any) => {
  switch (action.type) {
    case LOGINCHECK:
      console.log(action.payload);
      return { ...state, isLogin: "로그인완료", nickname: action.payload };
    case LOGOUTCHECK:
      return { ...state, isLogin: "로그아웃", nickname: "바보" };
    default:
      return state;
  }
};

export default authReducer;
