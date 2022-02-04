package com.ssafy.stomp.liargame.response;

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
public class RoleSubjectResult {
    private String nickname; //닉네임
    private String roleType; //역할(LIAR or MEMBER)
    private String subject; //제시어
}



