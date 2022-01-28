import { dividerClasses } from "@mui/material";
import React from "react";
import KakaoLogin from "react-kakao-login";

export default function KLogin() {

    let kakaoKey:string=process.env.REACT_APP_KAKAO_API_KEY||"";

    const onKakaoSuccess=(res : any) => {
        console.log(res)
    }

    const onKakaoFail=(err : any) => {
        console.log(err)
    }

    const onKakaoLogout=(res : any) => {
        console.log(res)
    }

    return (
        <span>
            <KakaoLogin 
                token={kakaoKey}
                onSuccess={onKakaoSuccess}
                onFail={onKakaoFail}
                onLogout={onKakaoLogout}
            />
        </span>
    )
}