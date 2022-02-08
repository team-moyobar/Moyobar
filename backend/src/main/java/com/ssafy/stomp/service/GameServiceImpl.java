package com.ssafy.stomp.service;


import com.ssafy.api.service.UserService;
import com.ssafy.db.entity.game.Game;
import com.ssafy.db.entity.game.GameCategory;
import com.ssafy.db.entity.game.GameWinner;
import com.ssafy.db.entity.user.User;
import com.ssafy.db.repository.game.GameCategoryRepository;
import com.ssafy.db.repository.game.GameWinnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ssafy.db.repository.game.GameRepository;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;

@Service("gameService")
public class GameServiceImpl implements GameService {

    @Autowired
    GameRepository gameRepository;
    @Autowired
    GameCategoryRepository categoryRepository;
    @Autowired
    GameWinnerRepository winnerRepository;
    @Autowired
    UserService userService;


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
    public Game updateGame(long gameId, List<String> winners) {
        Game game = gameRepository.findById(gameId).orElseThrow(EntityNotFoundException::new);

        for (String nickname : winners){
            User user = userService.getUserByNickname(nickname);

            GameWinner winner = new GameWinner();
            winner.setGame(game);
            winner.setWinner(user);

            winnerRepository.save(winner);
        }

        game.setEnd(LocalDateTime.now());

        return gameRepository.save(game);
    }

    @Override
    public List<User> getWinners(long gameId){
        return winnerRepository.findUserById(gameId);
    }
}
