package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToOne;

@Entity
@Getter
@Setter
public class Drink extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, mappedBy = "drink")
    private User user;

    private int beer;
    private int liquor;
    private int soju;

}