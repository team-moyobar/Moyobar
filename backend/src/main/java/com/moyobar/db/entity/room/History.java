package com.moyobar.db.entity.room;

import com.moyobar.db.entity.BaseEntity;
import com.moyobar.db.entity.user.User;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import java.util.Date;

@DynamicInsert
@Entity
@Getter
@Setter
@Table(name = "meeting_history")
public class History extends BaseEntity {

    @Enumerated(EnumType.STRING)
    private ActionType action;

    private Date inserted;

    private Date exited;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "meeting_id")
    private Room room;
}
