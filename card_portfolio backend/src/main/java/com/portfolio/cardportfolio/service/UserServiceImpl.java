package com.portfolio.cardportfolio.service;

import com.portfolio.cardportfolio.dto.CardDTO;
import com.portfolio.cardportfolio.entity.Card;
import com.portfolio.cardportfolio.entity.CustomUserDetails;
import com.portfolio.cardportfolio.entity.User;
import com.portfolio.cardportfolio.repo.CardRepo;
import com.portfolio.cardportfolio.repo.UserRepo;
import com.portfolio.cardportfolio.wrapper.PaginatedList;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class UserServiceImpl implements UserService{

    @Autowired
    private CardRepo cardRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ScraperService scraperService;

    @Override
    public String addCardToPortfolio(CustomUserDetails userDetails, Long cardID) {
        Optional<Card> card = cardRepo.findById(cardID);
        if(userDetails == null) {
            return "not logged in";
            //throw something
        }

        User user = userRepo.findByEmail(userDetails.getEmail());
        List<Card> portfolio = user.getPortfolio();

        boolean cardExists = portfolio.stream()
                .anyMatch(c -> (c.getTitle().equalsIgnoreCase(card.get().getTitle())
                        && c.getSubset().equalsIgnoreCase(card.get().getSubset())));

        if(cardExists) {
            portfolio.remove(card.get());
        }
        else {
            portfolio.add(card.get());
        }

        userRepo.save(user);

        return "success";
    }

    @Override
    public String addCardToWatchlist(CustomUserDetails userDetails, Long cardID) {
        Optional<Card> card = cardRepo.findById(cardID);

        if(userDetails == null) {
            return "not logged in";
            //throw something
        }

        User user = userRepo.findByEmail(userDetails.getEmail());
        List<Card> watchlist = user.getWatchlist();

        boolean cardExists = watchlist.stream()
                .anyMatch(c -> (c.getTitle().equalsIgnoreCase(card.get().getTitle())
                        && c.getSubset().equalsIgnoreCase(card.get().getSubset())));

        if(cardExists) {
            watchlist.remove(card.get());
        }
        else {
            watchlist.add(card.get());
        }

        userRepo.save(user);

        return "success";
    }

    @Override
    public List<CardDTO> getPortfolio(CustomUserDetails userDetails, int page) {
        if(userDetails == null) {
            return null;
            //throw something
        }
        User user = userRepo.findByEmail(userDetails.getEmail());
        ModelMapper mapper = new ModelMapper();
        List<CardDTO> cardDTOs = Arrays.asList(mapper.map(user.getPortfolio(), CardDTO[].class));

        cardDTOs.forEach(cardDTO -> {
            Card card = cardRepo.findByTitleAndRarityAndSubset(cardDTO.getTitle(), cardDTO.getRarity(), cardDTO.getSubset());
            if(user.getPortfolio().contains(card)) {
                cardDTO.setInPortfolio(true);
            }
            else {
                cardDTO.setInPortfolio(false);
            }
            if(user.getWatchlist().contains(card)) {
                cardDTO.setWatched(true);
            }
            else {
                cardDTO.setWatched(false);
            }
        });
        PaginatedList paginatedList = new PaginatedList(cardDTOs);

        return paginatedList.getPage(page);
    }

    @Override
    public List<CardDTO> getWatchlist(CustomUserDetails userDetails, int page) {
        if(userDetails == null) {
            return null;
            //throw something
        }
        User user = userRepo.findByEmail(userDetails.getEmail());
        ModelMapper mapper = new ModelMapper();
        List<CardDTO> cardDTOs = Arrays.asList(mapper.map(user.getWatchlist(), CardDTO[].class));

        cardDTOs.forEach(cardDTO -> {
            Card card = cardRepo.findByTitleAndRarityAndSubset(cardDTO.getTitle(), cardDTO.getRarity(), cardDTO.getSubset());
            if(user.getPortfolio().contains(card)) {
                cardDTO.setInPortfolio(true);
            }
            else {
                cardDTO.setInPortfolio(false);
            }
            if(user.getWatchlist().contains(card)) {
                cardDTO.setWatched(true);
            }
            else {
                cardDTO.setWatched(false);
            }
        });
        PaginatedList paginatedList = new PaginatedList(cardDTOs);

        return cardDTOs;
    }

    @Override
    public List<CardDTO> updatePortfolio(CustomUserDetails userDetails) {
        User user = userRepo.findByEmail(userDetails.getEmail());

        if(user == null) {
            return null;
        }
        ModelMapper mapper = new ModelMapper();
        List<Card> cards = user.getPortfolio();

        cards.forEach(card -> {
            String searchQuery = card.getTitle()+"+"+card.getSubset();
            scraperService.scrape(searchQuery, 1, 1);
        });
        log.info("User portfolio updated successfully.");
        PaginatedList paginatedList = new PaginatedList(user.getPortfolio());

        return Arrays.asList(mapper.map(paginatedList.getPage(1), CardDTO[].class));
    }
}
