package com.ssafy.api.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 유저 로그인 API ([POST] /api/v1/auth/login) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@ApiModel("UserLoginPostRequest")
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class UserLoginPostReq {
	@ApiModelProperty(name="유저 ID", example="ssafy@ssafy.com")
	String userId;
	@ApiModelProperty(name="유저 Password", example="ssafy")
	String password;
}