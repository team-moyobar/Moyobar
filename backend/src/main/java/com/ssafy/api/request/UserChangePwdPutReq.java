package com.ssafy.api.request;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 유저 비밀번호 변경 API ([PUT] /api/v1/users/password) 요청에 필요한 리퀘스트 바디 정의.
 */

@Getter
@Setter
@ApiModel("UserChangePwdPutReq")
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class UserChangePwdPutReq {
    @ApiModelProperty(name = "현재 비밀번호", example = "password")
    String password;
    @ApiModelProperty(name = "새로운 비밀번호", example = "newpassword")
    String newpassword;
}