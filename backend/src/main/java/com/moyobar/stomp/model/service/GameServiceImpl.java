package com.moyobar.stomp.model.service;

import com.moyobar.common.exception.UserNotFoundException;
import com.moyobar.db.entity.game.Game;
import com.moyobar.db.entity.game.GameCategory;
import com.moyobar.db.entity.game.GameInRoom;
import com.moyobar.db.entity.game.GameWinner;
import com.moyobar.db.entity.room.Room;
import com.moyobar.db.entity.user.User;
import com.moyobar.db.repository.game.GameCategoryRepository;
import com.moyobar.db.repository.game.GameInRoomRepository;
import com.moyobar.db.repository.game.GameWinnerRepository;
import com.moyobar.db.repository.user.UserRepository;
import com.moyobar.stomp.model.GameUpdateInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.moyobar.db.repository.game.GameRepository;

import javax.persistence.EntityNotFoundException;
import java.util.Date;
import java.util.List;

@Slf4j
@Service("gameService")
public class GameServiceImpl implements GameService {

    @Autowired
    private GameRepository gameRepository;
    @Autowired
    private GameInRoomRepository gameInRoomRepository;
    @Autowired
    private GameCategoryRepository categoryRepository;
    @Autowired
    private GameWinnerRepository winnerRepository;
    @Autowired
    private UserRepository userRepository;

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
    public Game updateGame(long gameId, GameUpdateInfo info) {
        Game game = gameRepository.findById(gameId).orElseThrow(EntityNotFoundException::new);

        if (info.isWinner()) {
            createGameWinner(game, info.getNickname());
        }
        updateUserScore(info);

        game.setEnd(new Date());

        return gameRepository.save(game);
    }

    @Override
    public Game updateGame(long gameId, List<GameUpdateInfo> infos) {
        Game game = gameRepository.findById(gameId).orElseThrow(EntityNotFoundException::new);

        //게임 끝나지도 않았는데 게임 시작 버튼 또 눌렀을 시에는 winner정보는 저장되지 않음
        if (infos != null) {
            for (GameUpdateInfo info : infos) {
                if (info.isWinner()) {
                    createGameWinner(game, info.getNickname());
                }
                updateUserScore(info);
            }
        }

        game.setEnd(new Date());

        return gameRepository.save(game);
    }

    private void createGameWinner(Game game, String nickname) {
        User user = userRepository.findByNickname(nickname).orElseThrow(UserNotFoundException::new);

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

        GameInRoom gameInRoom = new GameInRoom();
        gameInRoom.setRoom(room);
        gameInRoom.setGame(game);
        gameInRoomRepository.save(gameInRoom);
    }

    public void updateUserScore(GameUpdateInfo info) {
        User user = userRepository.findByNickname(info.getNickname()).orElseThrow(UserNotFoundException::new);

        log.info("{} 님 변경 전 score: {}", user.getNickname(), user.getScore());
        user.setScore(user.getScore() + info.getAddedScore());
        log.info("{} 님 변경 후 score: {}", user.getNickname(), user.getScore());

        userRepository.save(user);
    }
}
