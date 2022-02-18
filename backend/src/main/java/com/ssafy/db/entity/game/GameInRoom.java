package com.ssafy.db.entity.game;

import com.ssafy.db.entity.BaseEntity;
import com.ssafy.db.entity.room.Room;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Getter
@Setter
@Table(name = "meeting_has_game")
public class GameInRoom extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "meeting_id")
    private Room room;

    @ManyToOne
    @JoinColumn(name = "game_id")
    private Game game;
}
