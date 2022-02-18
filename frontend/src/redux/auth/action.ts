export const LOGINCHECK = "logincheck";
export const LOGOUTCHECK = "logoutcheck";

export const loginCheck = (data: any) => {
  return {
    type: LOGINCHECK,
    payload: data,
  };
};

export const logoutCheck = () => {
  return {
    type: LOGOUTCHECK,
  };
};
