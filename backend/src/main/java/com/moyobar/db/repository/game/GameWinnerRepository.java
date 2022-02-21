package com.moyobar.db.repository.game;

import com.moyobar.db.entity.game.GameWinner;
import com.moyobar.db.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameWinnerRepository extends JpaRepository<GameWinner, Long> {
    List<User> findUserById(long gameId);
}
