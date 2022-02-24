package com.moyobar.db.entity.user;

import com.moyobar.db.entity.BaseEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;

@Entity
@Getter
@Setter
public class Drink extends BaseEntity {
    private int beer;
    private int liquor;
    private int soju;
}