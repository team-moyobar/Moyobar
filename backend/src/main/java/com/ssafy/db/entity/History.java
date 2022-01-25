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

    // enum으로 바꿀지
    private String action;

    private Date inserted;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "meeting_id")
    private Room room;
}
