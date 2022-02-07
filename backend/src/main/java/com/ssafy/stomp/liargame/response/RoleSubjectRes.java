package com.ssafy.stomp.liargame.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 팀원들의 닉네임, 역할과 제시어 정보를 response
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class RoleSubjectRes {
    private String nickname; //닉네임
    private String roletype; //역할(LIAR or MEMBER)
    private String keyword; //제시어
}



