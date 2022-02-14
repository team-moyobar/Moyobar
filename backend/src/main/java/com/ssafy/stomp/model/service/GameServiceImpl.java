package com.ssafy.stomp.model.service;


import com.ssafy.api.service.UserService;
import com.ssafy.db.entity.game.Game;
import com.ssafy.db.entity.game.GameCategory;
import com.ssafy.db.entity.game.GameInRoom;
import com.ssafy.db.entity.game.GameWinner;
import com.ssafy.db.entity.room.Room;
import com.ssafy.db.entity.user.User;
import com.ssafy.db.repository.game.GameCategoryRepository;
import com.ssafy.db.repository.game.GameInRoomRepository;
import com.ssafy.db.repository.game.GameWinnerRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ssafy.db.repository.game.GameRepository;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Slf4j
@Service("gameService")
public class GameServiceImpl implements GameService {
    @Autowired
    GameRepository gameRepository;
    @Autowired
    GameInRoomRepository gameInRoomRepository;
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
        game.setStart(new Date());
        game.setCategory(category);

        return gameRepository.save(game);
    }

    @Override
    public Game updateGame(long gameId, String winner) {
        Game game = gameRepository.findById(gameId).orElseThrow(EntityNotFoundException::new);

        createGameWinner(game, winner);
        game.setEnd(new Date());

        return gameRepository.save(game);
    }

    @Override
    public Game updateGame(long gameId, List<String> winners) {
        Game game = gameRepository.findById(gameId).orElseThrow(EntityNotFoundException::new);

        //게임 끝나지도 않았는데 게임 시작 버튼 또 눌렀을 시에는 winner정보는 저장되지 않음
        if(winners!=null) {
            for (String nickname : winners) {
                createGameWinner(game, nickname);
            }
        }
        
        game.setEnd(new Date());

        return gameRepository.save(game);
    }

    private void createGameWinner(Game game, String nickname) {
        User user = userService.getUserByNickname(nickname);

        GameWinner winner = new GameWinner();
        winner.setGame(game);
        winner.setWinner(user);

        winnerRepository.save(winner);
    }

    @Override
    public List<User> getWinners(long gameId) {
        return winnerRepository.findUserById(gameId);
    }

    @Override
    public void createGameInRoom(Room room, Game game) {
        log.info("gameName : {}", game.getCategory().getName());

        GameInRoom gameInRoom  = new GameInRoom();
        gameInRoom.setRoom(room);
        gameInRoom.setGame(game);
        gameInRoomRepository.save(gameInRoom);
    }
}
