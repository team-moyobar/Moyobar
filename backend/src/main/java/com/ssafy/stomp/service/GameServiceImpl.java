package com.ssafy.stomp.service;


import com.ssafy.db.entity.Game;
import com.ssafy.db.entity.GameCategory;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.GameCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ssafy.db.repository.GameRepository;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;

@Service("gameService")
public class GameServiceImpl implements GameService {

    @Autowired
    GameRepository gameRepository;
    @Autowired
    GameCategoryRepository categoryRepository;

    @Override
    public Game createGame(String gameName) {

        GameCategory category;
        if (categoryRepository.existsByName(gameName)) {
            category = categoryRepository.findByName(gameName);
        } else {
            category = new GameCategory();
            category.setName(gameName);

            categoryRepository.save(category);
        }

        Game game = new Game();
        game.setStart(LocalDateTime.now());
        game.setCategory(category);

        return gameRepository.save(game);
    }

    @Override
    public Game updateGame(long gameId, User winner) {
        Game game = gameRepository.findById(gameId).orElseThrow(EntityNotFoundException::new);

        game.setWinner(winner);
        game.setEnd(LocalDateTime.now());

        return gameRepository.save(game);
    }
}
