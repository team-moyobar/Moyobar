import { dividerClasses } from "@mui/material";
import React from "react";
import KakaoLogin from "react-kakao-login";

export default function KLogin() {

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
        <div>
            <KakaoLogin 
                token={'2db2329b983571c847c4d4974932ab64'}
                onSuccess={onKakaoSuccess}
                onFail={onKakaoFail}
                onLogout={onKakaoLogout}
            />
        </div>
    )
}