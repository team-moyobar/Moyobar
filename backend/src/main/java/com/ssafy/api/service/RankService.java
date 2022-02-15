package com.ssafy.api.service;

import com.ssafy.api.response.RankRes;

import java.util.List;

public interface RankService {
    List<RankRes> getRankList();

    RankRes getUserRank(String nickname);
}
