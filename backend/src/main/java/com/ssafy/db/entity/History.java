package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.data.annotation.CreatedDate;

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

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "meeting_id")
    private Room room;
}
