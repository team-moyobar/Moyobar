package com.moyobar.api.request;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.moyobar.security.oauth2.entity.ProviderType;
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
	@ApiModelProperty(name="유저 ID", example="test1@naver.com")
	private String userId;
	@ApiModelProperty(name="유저 Password", example="testtest1!")
	private String password;
	@ApiModelProperty(name = "유저 로그인 유형",example = "LOCAL")
	private ProviderType type;
}