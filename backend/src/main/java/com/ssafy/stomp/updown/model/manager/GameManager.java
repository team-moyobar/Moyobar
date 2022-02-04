package com.ssafy.stomp.updown.model.manager;

import com.ssafy.db.entity.User;
import com.ssafy.stomp.updown.model.GameStatus;
import com.ssafy.stomp.updown.model.GameType;
import com.ssafy.stomp.updown.model.UserStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Getter
@Setter
public class GameManager {

    private Map<String, UserStatus> userStatus = new ConcurrentHashMap<>();

    private GameStatus gameStatus;
    int userInRoomCount;
    int userInReadyCount;


    public GameManager(List<User> users) {

        userInReadyCount = 0;
        userInRoomCount = users.size();
        gameStatus = GameStatus.WAIT;

        for (User user : users){
            userStatus.put(user.getNickname(), UserStatus.WAIT);
        }
    }

    public boolean joinGame(User user){

        String nickname = user.getNickname();

        userStatus.put(nickname, UserStatus.READY);
        userInReadyCount++;

        if (userInReadyCount == userInRoomCount){
            gameStatus = GameStatus.READY;
            return true;
        }
        return false;
    }

    public boolean waitGame(User user) {

        String nickname = user.getNickname();

        userStatus.put(nickname, UserStatus.WAIT);
        userInReadyCount--;

        return false;

    }

    public boolean leaveGame(User user){
        String nickname = user.getNickname();

        if (userStatus.get(nickname) != UserStatus.WAIT)
            userInReadyCount--;

        userInRoomCount--;
        userStatus.remove(nickname);

        if (userInReadyCount == userInRoomCount){
            gameStatus = GameStatus.READY;
            return true;
        }else
            gameStatus = GameStatus.WAIT;
        return false;
    }

    public void startGame(GameType gameType) {

    }

}
