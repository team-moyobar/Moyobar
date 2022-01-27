import * as React from 'react';
import GoogleLogin from 'react-google-login';

import "./GLogin.css"

const GLogin = () => {
    //클라이언트 ID (환경변수)
    let googleClientId:string=process.env.REACT_APP_GOOGLE_CLIENT_ID||"";

    //사용자 정보를 담아둘 userObj
    const [userObj, setUserObj]=React.useState({
        email:"",
        name:""
    });

    const onLoginSuccess=(res : any) => {
        console.log(res)
    }

    return (
        <span id='glogin-button'>
            <GoogleLogin
                clientId = {googleClientId}
                onSuccess={result=>onLoginSuccess(result)}
                onFailure={result=>console.log(result)}
            />
        </span>
    );

}

export default GLogin;