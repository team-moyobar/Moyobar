import { LOGINCHECK, LOGOUTCHECK } from "./action";

const userStore = {
  isLogin: false,
  nickname: "",
};

const authReducer = (state = userStore, action: any) => {
  switch (action.type) {
    case LOGINCHECK:
      console.log(action.payload);
      return { ...state, isLogin: true, nickname: action.payload };
    case LOGOUTCHECK:
      return { ...state, isLogin: false, nickname: "" };
    default:
      return state;
  }
};

export default authReducer;
