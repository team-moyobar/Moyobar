package com.ssafy.api.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Drink;
import com.ssafy.db.entity.User;

import com.ssafy.security.oauth2.entity.ProviderType;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

/**
 * 회원 본인 정보 조회 API ([GET] /api/v1/users/info) 요청에 대한 응답값 정의.
 * 로그인한 유저 목록 조회 API ([GET] /api/v1/users/online) 요청에 대한 응답값 정의.
 */
@Getter
@Setter
@ApiModel("UserResponse")
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class UserRes {
	@ApiModelProperty(name = "User Id")
	private String userId;
	@ApiModelProperty(name = "User Nickname")
	private String nickname;
	@ApiModelProperty(name = "User birthday")
	@JsonFormat(pattern = "yyyy-MM-dd")
	private Date birthday;
	@ApiModelProperty(name = "User profile img path")
	private String img;
	@ApiModelProperty(name = "User score")
	private int score;
	@ApiModelProperty(name = "User drink info")
	private Drink drink;
	@ApiModelProperty(name = "User phone number")
	private String phone;
	@ApiModelProperty(name = "User login type")
	private ProviderType type;

	public static UserRes of(User user) {
		UserRes res = new UserRes();

		res.setUserId(user.getUserId());
		res.setNickname(user.getNickname());
		res.setBirthday(user.getBirthday());
		res.setImg(user.getImg());
		res.setDrink(user.getDrink());
		res.setPhone(user.getPhone());
		res.setType(user.getType());
		return res;
	}
}