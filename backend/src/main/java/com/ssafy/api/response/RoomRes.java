package com.ssafy.api.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.ssafy.db.entity.room.Room;
import com.ssafy.db.entity.room.RoomType;
import com.ssafy.db.entity.user.User;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 방 생성 후 방 정보 조회 API ([POST /api/v1/rooms) 요청에 대한 응답값 정의.
 */
@Getter
@Setter
@ApiModel("RoomResponse")
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class RoomRes {

    @ApiModelProperty(name = "Room Id")
    private Long roomId;
    @ApiModelProperty(name = "Room title")
    private String title;
    @ApiModelProperty(name = "Room description")
    private String description;
    @ApiModelProperty(name = "Room isActive")
    private boolean isActive;
    @ApiModelProperty(name = "Room max number of people")
    private int max;
    @ApiModelProperty(name = "Room started date")
    private Date start;
    @ApiModelProperty(name = "Room ended date")
    private Date end;
    @ApiModelProperty(name = "Room thumbnail")
    private String thumbnail;
    @ApiModelProperty(name = "Room participant")
    private List<UserInRoomRes> participants;
    @ApiModelProperty(name = "Room type")
    private RoomType type;
    @ApiModelProperty(name = "Room owner")
    private String owner;
    @ApiModelProperty(name = "방 테마 인덱스 번호")
    private int theme;

    public static RoomRes of(Room room, List<User> users) {
        RoomRes res = new RoomRes();

        res.setRoomId(room.getId());
        res.setTitle(room.getTitle());
        res.setDescription(room.getDescription());
        res.setActive(room.getIsActive() == 0);
        res.setMax(room.getMax());
        res.setStart(room.getStart());
        res.setEnd(room.getEnd());
        res.setThumbnail(room.getThumbnail());
        res.setParticipants(users.stream().map(UserInRoomRes::of).collect(Collectors.toList()));
        res.setType(room.getType());
        res.setOwner(room.getOwner().getNickname());
        res.setTheme(room.getTheme());
        return res;
    }
}
