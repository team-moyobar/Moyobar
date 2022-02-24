package com.moyobar.api.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.moyobar.common.model.response.BaseResponseBody;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("RoomRegisterPostResponse")
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class RoomRegisterPostRes extends BaseResponseBody {

    @ApiModelProperty(name = "생성된 방 번호", example = "8")
    long roomId;
    String owner;

    public static RoomRegisterPostRes of(Integer status, String message, long roomId, String owner) {
        RoomRegisterPostRes res = new RoomRegisterPostRes();
        res.setStatus(status);
        res.setMessage(message);
        res.setRoomId(roomId);
        res.setOwner(owner);
        return res;
    }
}
