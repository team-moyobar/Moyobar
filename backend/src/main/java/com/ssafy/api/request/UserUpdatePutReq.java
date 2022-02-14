package com.ssafy.api.request;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 유저 정보 수정 API ([PUT] /api/v1/users/info) 요청에 필요한 리퀘스트 바디 정의.
 */

@Getter
@Setter
@ApiModel("UserUpdatePutReq")
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)

public class UserUpdatePutReq {
        @ApiModelProperty(name = "유저 Nickname", example = "ssafy2")
        private String nickname;
        @ApiModelProperty(name = "유저 프로필 이미지", example = "profile2.png")
        private String img;
        @ApiModelProperty(name = "유저 주량 정보")
        private DrinkReq drink;
        @ApiModelProperty(name = "유저 자기소개", example = "안녕하세요 모여바 수정입니다.")
        private String description;
}
