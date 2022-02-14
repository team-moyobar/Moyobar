package com.ssafy.api.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@ApiModel("UserLogResponse")
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class UserLogRes {

    @ApiModelProperty(name = "Date")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(timezone = "Asia/Seoul")
    private Date date;

    @ApiModelProperty(name = "Count of Entrance")
    private int count;

    @ApiModelProperty(name = "Elapsed Time(min)")
    private long elapsedTime;
}
