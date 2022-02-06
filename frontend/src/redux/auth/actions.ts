export const LOGINCHECK = "logincheck";
export const LOGOUTCHECK = "logoutcheck";

export const loginCheck = (data: any) => {
  return {
    type: LOGINCHECK,
  };
};

export const logoutCheck = () => {
  return {
    type: LOGOUTCHECK,
  };
};
