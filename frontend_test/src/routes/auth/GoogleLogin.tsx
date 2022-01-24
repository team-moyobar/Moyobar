import * as React from 'react';
import GoogleLogin from 'react-google-login';

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
        <div>
            <GoogleLogin 
                clientId = {googleClientId}
                buttonText="Google"
                onSuccess={result=>onLoginSuccess(result)}
                onFailure={result=>console.log(result)}
            />
        </div>
    );

}

export default GLogin;