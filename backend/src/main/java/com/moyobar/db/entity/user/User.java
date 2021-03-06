package com.moyobar.db.entity.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import com.moyobar.db.entity.BaseEntity;
import com.moyobar.db.entity.room.History;
import lombok.Getter;
import lombok.Setter;
import com.moyobar.security.oauth2.entity.ProviderType;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 유저 모델 정의.
 */
@Entity
@Getter
@Setter
public class User extends BaseEntity {

    @Column(name = "user_id")
    private String userId;

    @Column(name = "nick")
    private String nickname;

    @Column(name = "`desc`")
    private String description;
    
    @JsonIgnore
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name ="pwd")
    private String password;

    @Column(name = "birth")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date birthday;

    private String img;

    private int score;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "drink_id")
    private Drink drink;

    private String phone;

    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private ProviderType type;

    private int first;

    @OneToMany(mappedBy = "user")
    private List<History> histories = new ArrayList<>();
}