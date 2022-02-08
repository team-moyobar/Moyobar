package com.ssafy.stomp.updown.model.manager;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.ssafy.db.entity.user.User;
import com.ssafy.stomp.updown.model.*;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.util.*;

@Getter
@Setter
@Slf4j
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class GameManager {

    private long gameId;

    private GameStatusType gameStatus;

    private List<String> userOrder;

    private int orderIndex;
    private int turnCount;

    private int answer;

    private int userInRoomCount;

    public GameManager(List<User> users) {

        userInRoomCount = users.size();

        orderIndex = 0;
        turnCount = 1;

        userOrder = new ArrayList<>();

        for (User user : users) {
            addUser(user);
        }
    }
    public void startGame() {

        // 게임 상태 START
        gameStatus = GameStatusType.START;

        // 게임 순서 랜덤으로 정하기
        Collections.shuffle(userOrder);

        // 랜덤으로 숫자 지정
        setRandomAnswer();
    }

    private void setRandomAnswer() {

        Random random = new Random();
        answer = random.nextInt(100) + 1;
    }

    private void addUser(User user) {
        userOrder.add(user.getNickname());
    }

    public CheckResultType checkAnswer(int number) {
        gameStatus = GameStatusType.PLAY;

        if (answer == number){
            gameStatus = GameStatusType.FINISH;
            return CheckResultType.CORRECT;
        }

        orderIndex = (orderIndex + 1) % userInRoomCount;
        turnCount++;

        if (answer > number)
            return CheckResultType.UP;
        else
            return CheckResultType.DOWN;
    }
}