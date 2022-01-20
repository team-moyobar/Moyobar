package com.ssafy.api.request;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

/**
 * 유저 회원가입 API ([POST] /api/v1/users) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@ApiModel("UserRegisterPostRequest")
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class UserRegisterPostReq {

	@ApiModelProperty(name = "유저 ID", example = "ssafy@ssafy.com")
	private String userId;
	@ApiModelProperty(name = "유저 Nickname", example = "ssafy")
	private String nickname;
	@ApiModelProperty(name = "유저 Password", example = "ssafy")
	private String password;
	@ApiModelProperty(name = "유저 생년월일",example = "2022-01-19")
	private Date birthday;
	@ApiModelProperty(name = "유저 휴대폰 번호", example = "010-1111-1111")
	private String phone;
	@ApiModelProperty(name = "유저 로그인 유형", example = "local")
	private String type;
}