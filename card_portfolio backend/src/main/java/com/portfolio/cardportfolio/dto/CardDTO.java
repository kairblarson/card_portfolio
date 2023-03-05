package com.portfolio.cardportfolio.dto;

import lombok.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class CardDTO {

    private Long id;
    private Integer productNo;
    private String title;
    private String image;
    private Double marketPrice;
    private Map<Long, Double> priceHistory = new HashMap<>();
    private String category;
    private String subset;
    private String rarity;
    private String lastUpdated;
    private boolean inPortfolio;
    private boolean isWatched;
    private boolean isTrending;

}
