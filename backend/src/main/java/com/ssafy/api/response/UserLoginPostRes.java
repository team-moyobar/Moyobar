package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 유저 로그인 API ([POST] /api/v1/auth) 요청에 대한 응답값 정의.
 */
@Getter
@Setter
@ApiModel("UserLoginPostResponse")
public class UserLoginPostRes extends BaseResponseBody {
    @ApiModelProperty(name = "JWT 인증 토큰", example = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN...")
    String accessToken;
    boolean first;
    @ApiModelProperty(name = "User Nickname")
    String nickname;

    public static UserLoginPostRes of(Integer status, String message, String accessToken) {
        UserLoginPostRes res = new UserLoginPostRes();
        res.setStatus(status);
        res.setMessage(message);
        res.setAccessToken(accessToken);
        return res;
    }

    public static UserLoginPostRes of(Integer statusCode, String message, String accessToken, boolean first, String nickname) {
        UserLoginPostRes res = of(statusCode, message, accessToken);
        res.setFirst(first);
        res.setNickname(nickname);
        return res;
    }
}