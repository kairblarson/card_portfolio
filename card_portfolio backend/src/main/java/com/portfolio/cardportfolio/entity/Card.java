package com.portfolio.cardportfolio.entity;

import jakarta.persistence.*;
import lombok.*;

import java.text.SimpleDateFormat;
import java.util.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Table(name = "card")
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Integer productNo;
    private String title;
    private String image;
    private Double marketPrice;
    private Double purchasedPrice;
    @ElementCollection(fetch = FetchType.LAZY)
    private Map<Long, Double> priceHistory = new HashMap<>();
    private String category;
    private String subset;
    private String rarity;
    private String lastUpdated;
    private boolean isTrending;

    public void addToPriceHistory(Double price) {
        Long date = new Date().getTime();
        date = (long) (Math.ceil(date/86398000))*86400000;
        //86398000 works pretty well, date is correct up until at least 11:02pm of same day dk where it switches tho
        //it had not switched at 12:41am to the next day.
        priceHistory.put(date, price);
    }

}
