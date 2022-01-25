package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("DrinkRequest")
public class DrinkReq {
    @ApiModelProperty(name = "소주", example = "1")
    private int soju;
    @ApiModelProperty(name = "양주", example = "2")
    private int liquor;
    @ApiModelProperty(name = "맥주", example = "3")
    private int beer;
}
