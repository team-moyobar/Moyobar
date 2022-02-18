package com.ssafy.db.entity.game;

import com.ssafy.db.entity.BaseEntity;
import com.ssafy.db.entity.user.User;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class GameWinner extends BaseEntity {

    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User winner;

    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id")
    private Game game;
}
