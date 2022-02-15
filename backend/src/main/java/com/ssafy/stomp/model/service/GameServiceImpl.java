package com.ssafy.stomp.model.service;


import com.ssafy.api.service.UserService;
import com.ssafy.common.exception.UserNotFoundException;
import com.ssafy.db.entity.game.Game;
import com.ssafy.db.entity.game.GameCategory;
import com.ssafy.db.entity.game.GameInRoom;
import com.ssafy.db.entity.game.GameWinner;
import com.ssafy.db.entity.room.Room;
import com.ssafy.db.entity.user.User;
import com.ssafy.db.repository.game.GameCategoryRepository;
import com.ssafy.db.repository.game.GameInRoomRepository;
import com.ssafy.db.repository.game.GameWinnerRepository;
import com.ssafy.db.repository.user.UserRepository;
import com.ssafy.stomp.model.GameUpdateInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.ssafy.db.repository.game.GameRepository;

import javax.persistence.EntityNotFoundException;
import java.util.Date;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service("gameService")
public class GameServiceImpl implements GameService {
    private final GameRepository gameRepository;
    private final GameInRoomRepository gameInRoomRepository;
    private final GameCategoryRepository categoryRepository;
    private final GameWinnerRepository winnerRepository;
    private final UserRepository userRepository;

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
