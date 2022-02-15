package com.ssafy.api.controller;

import com.ssafy.api.response.RankRes;
import com.ssafy.api.service.RankService;
import com.ssafy.common.exception.ErrorResponse;
import io.swagger.annotations.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;

/**
 * 게임 랭킹 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "랭킹 API", tags = {"Ranking"})
@Slf4j
@RestController
@RequestMapping("/api/v1/rank")
public class RankingController {

    @Autowired
    private RankService rankService;

    @GetMapping()
    @ApiOperation(value = "랭킹 순위 조회", notes = " 랭킹 순위를 조회 한다")
    @ApiResponses({
            @ApiResponse(code = 200, message = "랭킹 조회 성공"),
            @ApiResponse(code = 403, message = "인증 실패", response = ErrorResponse.class),
            @ApiResponse(code = 400, message = "잘못된 접근", response = ErrorResponse.class),
            @ApiResponse(code = 500, message = "서버 오류", response = ErrorResponse.class)
    })
    public ResponseEntity<List<RankRes>> rankingList(@ApiIgnore Authentication authentication) {
        log.info("순위 목록 조회");

        return ResponseEntity.status(200).body(rankService.getRankList());
    }

    @GetMapping("/{nickname}")
    @ApiOperation(value = "사용자 랭킹 순위 조회", notes = "조회할 사용자의 랭킹 순위를 조회 한다")
    @ApiResponses({
            @ApiResponse(code = 200, message = "랭킹 조회 성공"),
            @ApiResponse(code = 403, message = "인증 실패", response = ErrorResponse.class),
            @ApiResponse(code = 400, message = "잘못된 접근", response = ErrorResponse.class),
            @ApiResponse(code = 500, message = "서버 오류", response = ErrorResponse.class)
    })
    public ResponseEntity<RankRes> userRanking(@ApiIgnore Authentication authentication,
                                                     @ApiParam(value = "검색할 사용자 닉네임") @PathVariable String nickname ) {
        log.info("사용자: {} 순위 조회", nickname);

        return ResponseEntity.status(200).body(rankService.getUserRank(nickname));
    }

}
