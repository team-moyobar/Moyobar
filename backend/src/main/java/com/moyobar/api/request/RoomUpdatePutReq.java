package com.moyobar.api.request;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.moyobar.db.entity.room.RoomType;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("RoomUpdatePutRequest")
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class RoomUpdatePutReq {

    @ApiModelProperty(name = "방 제목")
    private String title;
    @ApiModelProperty(name = "방 소개글")
    private String description;
    @ApiModelProperty(name = "방 최대 인원")
    private int max;
    @ApiModelProperty(name = "방 공개여부")
    private RoomType type;
    @ApiModelProperty(name = "방 비밀번호")
    private String password;
    @ApiModelProperty(name = "방 주인")
    private String owner;
    @ApiModelProperty(name = "방 테마 인덱스 번호")
    private int theme;

}