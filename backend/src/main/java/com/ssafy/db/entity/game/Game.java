package com.ssafy.db.entity.game;

import com.ssafy.db.entity.BaseEntity;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter
@Setter
public class Game extends BaseEntity {

    @CreationTimestamp
    private Date start;

    @UpdateTimestamp
    private Date end;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private GameCategory category;
}
