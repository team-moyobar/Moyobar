package com.moyobar.api.service;

import com.moyobar.api.response.RankRes;
import com.moyobar.common.exception.UserNotFoundException;
import com.moyobar.db.entity.user.User;
import com.moyobar.db.repository.user.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service("rankService")
public class RankServiceImpl implements RankService {

    private final int TOP_RANK_COUNT = 10;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<RankRes> getRankList() {
        List<RankRes> res = new ArrayList<>();

        int currentRank = 1;
        int tieCount = 1;

        List<User> users = userRepository.findAll();

        // 사용자 정보 받아와서 점수 순, 동점일 경우 이름 순으로 정렬
        users.sort((u1, u2) -> {
            if (u1.getScore() == u2.getScore())
                return u1.getNickname().compareTo(u2.getNickname());
            return -u1.getScore() + u2.getScore();
        });

        if (users.size() == 0) return res;

        res.add(new RankRes(currentRank, users.get(0).getNickname(), users.get(0).getScore()));

        for (int i = 1; i < users.size(); i++) {
            User user = users.get(i);
            RankRes rank;
            if (res.get(i - 1).getScore() == user.getScore()) {
                rank = new RankRes(currentRank, user.getNickname(), user.getScore());
                tieCount++;
            } else {
                currentRank += tieCount;
                if (currentRank > TOP_RANK_COUNT) break;
                rank = new RankRes(currentRank, user.getNickname(), user.getScore());
                tieCount = 1;
            }
            res.add(rank);
        }

        return res;
    }

    @Override
    public RankRes getUserRank(String nickname) {
        User user = userRepository.findByNickname(nickname).orElseThrow(UserNotFoundException::new);
        long rank = userRepository.getUserRank(user);

        return new RankRes(rank, user.getNickname(), user.getScore());
    }
}
