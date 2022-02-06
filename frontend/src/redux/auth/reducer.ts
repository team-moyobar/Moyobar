import { LOGINCHECK, LOGOUTCHECK } from "./actions";

const initialStore = {
  isLogin: false,
  nickName: "",
};

const authReducer = (state = initialStore, action: any) => {
  switch (action.type) {
    case LOGINCHECK:
      return { ...state, isLogin: true };
    case LOGOUTCHECK:
      return { ...state, isLogin: false };
    default:
      return state;
  }
};

export default authReducer;
