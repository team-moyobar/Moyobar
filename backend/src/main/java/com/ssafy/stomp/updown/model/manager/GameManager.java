package com.ssafy.stomp.updown.model.manager;

import com.ssafy.db.entity.User;
import com.ssafy.stomp.updown.model.*;
import com.ssafy.stomp.updown.request.CheckAnswerReq;
import com.ssafy.stomp.updown.request.GameStartReq;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Getter
@Setter
public class GameManager {

    private Map<String, UserInfo> userInfo = new ConcurrentHashMap<>();

    private List<String> userOrder;
    private int turnIndex;

    private GameStatus gameStatus;

    private GameType gameType;
    private int answer;

    private int userInRoomCount;
    private int userInReadyCount;


    public GameManager(List<User> users) {

        userInReadyCount = 0;
        userInRoomCount = users.size();
        gameStatus = GameStatus.WAIT;

        for (User user : users) {
            addUser(user);
        }
    }

    public boolean joinGame(User user) {

        String nickname = user.getNickname();

        if (!userInfo.containsKey(nickname)) {
            addUser(user);
            userInRoomCount++;
        }

        UserInfo info = userInfo.get(nickname);
        info.setUserStatus(UserStatus.READY);
        userInReadyCount++;

        if (userInReadyCount == userInRoomCount) {
            gameStatus = GameStatus.READY;
            return true;
        }
        return false;
    }

    public boolean waitGame(User user) {

        String nickname = user.getNickname();

        UserInfo info = userInfo.get(nickname);
        info.setUserStatus(UserStatus.WAIT);
        userInReadyCount--;

        return false;

    }

    public boolean leaveGame(User user) {
        String nickname = user.getNickname();

        UserInfo info = userInfo.get(nickname);

        if (info.getUserStatus() != UserStatus.WAIT)
            userInReadyCount--;

        userInRoomCount--;
        userInfo.remove(nickname);

        if (userInReadyCount == userInRoomCount) {
            gameStatus = GameStatus.READY;
            return true;
        } else
            gameStatus = GameStatus.WAIT;
        return false;
    }

    public void startGame(GameStartReq startInfo) {

        gameType = startInfo.getGameType();

        setUserOrder(userInfo.keySet().stream().sorted().collect(Collectors.toList()));

        if (gameType == GameType.RANDOM) {
            setRandomAnswer();
        } else {
            answer = startInfo.getAnswer();
        }
    }

    private void setRandomAnswer() {

        Random random = new Random();
        answer = random.nextInt();
    }

    private void addUser(User user) {

        UserInfo info = new UserInfo();
        info.setUserStatus(UserStatus.WAIT);
        userInfo.put(user.getNickname(), info);

    }

    public GameResultType checkAnswer(CheckAnswerReq checkInfo) {
        if (answer == checkInfo.getNumber())
            return GameResultType.CORRECT;

        if (userOrder.size() == ++turnIndex)
            return GameResultType.TIMEOUT;
        else if (answer > checkInfo.getNumber())
            return GameResultType.UP;
        else
            return GameResultType.DOWN;
    }
}
