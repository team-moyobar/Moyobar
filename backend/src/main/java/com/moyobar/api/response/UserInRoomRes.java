package com.moyobar.api.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.moyobar.db.entity.user.User;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("UserInRoomResponse")
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class UserInRoomRes {
    @ApiModelProperty(name = "User Id")
    private String userId;
    @ApiModelProperty(name = "User Nickname")
    private String nickname;

    public static UserInRoomRes of(User user) {
        UserInRoomRes res = new UserInRoomRes();

        res.setUserId(user.getUserId());
        res.setNickname(user.getNickname());
        return res;
    }
}
