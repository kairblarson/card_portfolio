package com.portfolio.cardportfolio.service;

import com.portfolio.cardportfolio.dto.CardDTO;
import com.portfolio.cardportfolio.entity.CustomUserDetails;

import java.util.List;

public interface UserService {

    String addCardToPortfolio(CustomUserDetails userDetails, Long cardID);
    String addCardToWatchlist(CustomUserDetails userDetails, Long cardID);

    List<CardDTO> getPortfolio(CustomUserDetails userDetails, int page);

    List<CardDTO> getWatchlist(CustomUserDetails userDetails, int page);
    List<CardDTO> updatePortfolio(CustomUserDetails userDetails);
}
