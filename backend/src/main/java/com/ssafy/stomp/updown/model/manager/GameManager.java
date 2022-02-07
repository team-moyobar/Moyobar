package com.ssafy.stomp.updown.model.manager;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.ssafy.db.entity.User;
import com.ssafy.stomp.updown.model.*;
import com.ssafy.stomp.updown.request.CheckAnswerReq;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.util.*;

@Getter
@Setter
@Slf4j
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class GameManager {

    private List<String> userOrder;

    private int orderIndex;
    private int currentTurnCount;
    private int totalTurnCount;

    private int answer;

    private int userInRoomCount;

    public GameManager(List<User> users) {

        userInRoomCount = users.size();
        orderIndex = 0;

        currentTurnCount = 1;

        userOrder = new ArrayList<>();

        for (User user : users) {
            addUser(user);
        }
    }
    public void startGame() {

        // 게임 순서 랜덤으로 정하기
        Collections.shuffle(userOrder);

        // 턴 횟수: 사용자 수의 2배
        totalTurnCount = userInRoomCount * 2;

        // 랜덤으로 숫자 지정
        setRandomAnswer();
    }

//    public boolean leaveGame(User user) {
//        String nickname = user.getNickname();
//
//        userInRoomCount--;
//        if (turnIndex == userOrder.indexOf(nickname)){
//            turnIndex = turnIndex % userInRoomCount;
//        }else{
//
//        }
//        userOrder.remove(nickname);
//
//        return true;
//    }


    private void setRandomAnswer() {

        Random random = new Random();
        answer = random.nextInt(1000) + 1;
    }

    private void addUser(User user) {
        userOrder.add(user.getNickname());
    }

    public GameResultType checkAnswer(CheckAnswerReq checkInfo) {
        if (answer == checkInfo.getNumber())
            return GameResultType.CORRECT;

        orderIndex = (orderIndex + 1 ) % userInRoomCount;

        if (currentTurnCount == totalTurnCount)
            return GameResultType.TIMEOUT;

        currentTurnCount++;
        if (answer > checkInfo.getNumber())
            return GameResultType.UP;
        else
            return GameResultType.DOWN;
    }
}
