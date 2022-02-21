package com.moyobar.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("RoomJoinPostRequest")
public class RoomJoinPostReq {

    @ApiModelProperty(name = "방 비밀번호")
    private String password;
}
