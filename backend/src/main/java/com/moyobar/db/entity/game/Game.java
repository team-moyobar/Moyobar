package com.moyobar.db.entity.game;

import com.moyobar.db.entity.BaseEntity;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
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
