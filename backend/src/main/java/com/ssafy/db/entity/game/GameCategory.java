package com.ssafy.db.entity.game;

import com.ssafy.db.entity.BaseEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Getter
@Setter
@Table(name = "game_category")
public class GameCategory extends BaseEntity {
    private String name;
}
