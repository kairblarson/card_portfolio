package com.portfolio.cardportfolio.service;

import com.portfolio.cardportfolio.dto.CardDTO;
import com.portfolio.cardportfolio.entity.CustomUserDetails;

import java.util.HashMap;
import java.util.List;

public interface CardService {

    public List<CardDTO> search(String keyword, CustomUserDetails userDetails, int page);
    public String deepSearch(String keyword, int intPage, int maxPage);
    public CardDTO viewCard(Long id, CustomUserDetails userDetails);
    public HashMap<Long, Double> totalPriceHistory(CustomUserDetails userDetails);
    public List<CardDTO> getTrendingCards(CustomUserDetails userDetails);
    public List<CardDTO> getSuggestions(CustomUserDetails userDetails);
}
