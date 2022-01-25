package com.ssafy.api.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.ssafy.common.model.response.BaseResponseBody;
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

    public static RoomRegisterPostRes of(Integer status, String message, long roomId) {
        RoomRegisterPostRes res = new RoomRegisterPostRes();
        res.setStatus(status);
        res.setMessage(message);
        res.setRoomId(roomId);
        return res;
    }
}
