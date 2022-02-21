package com.moyobar.api.service;

import com.moyobar.api.response.RankRes;

import java.util.List;

public interface RankService {
    List<RankRes> getRankList();

    RankRes getUserRank(String nickname);
}
