package com.ssafy.db.repository.game;

import com.ssafy.db.entity.game.GameWinner;
import com.ssafy.db.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameWinnerRepository extends JpaRepository<GameWinner, Long> {
    List<User> findUserById(long gameId);
}
