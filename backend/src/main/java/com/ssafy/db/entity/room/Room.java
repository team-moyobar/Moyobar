package com.ssafy.db.entity.room;

import com.ssafy.db.entity.BaseEntity;
import com.ssafy.db.entity.user.User;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@DynamicInsert
@Entity
@Getter
@Setter
@Table(name = "meeting_room")
public class Room extends BaseEntity {

    private Date start;
    private Date end;
    private String thumbnail;

    private String title;

    @Column(name = "`desc`")
    private String description;

    @Column(name = "is_active")
    private int isActive;

    private int max;

    @Enumerated(EnumType.STRING)
    private RoomType type;

    @Column(name = "pwd")
    private String password;

    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinColumn(name = "owner")
    private User owner;

    @OneToMany(mappedBy = "room")
    private List<History> histories = new ArrayList<>();

    private int theme;
}
