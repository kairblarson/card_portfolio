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

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Slf4j
public class CardServiceImpl implements CardService{

    @Autowired
    private CardRepo cardRepo;

    @Autowired
    private ScraperService scraperService;

    @Autowired
    private UserRepo userRepo;

    @Override
    public List<CardDTO> search(String keyword, CustomUserDetails userDetails, int page) {
        String res = "";

        List<Card> cards = cardRepo.queryCards(keyword);
        ModelMapper mapper = new ModelMapper();
        List<CardDTO> cardDTOs = Arrays.asList(mapper.map(cards, CardDTO[].class));

        if(userDetails != null) {
            User user = userRepo.findByEmail(userDetails.getEmail());
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
        }
        PaginatedList paginatedList = new PaginatedList(cardDTOs);

        return paginatedList.getPage(page);
    }

    @Override
    public String deepSearch(String keyword, int intPage, int maxPage) {

        String deepSearchRes = scraperService.scrape(keyword, intPage, maxPage);
        //basically just says to scrape the data from tcg if user wants

        return deepSearchRes;
    }

    @Override
    public CardDTO viewCard(Long id, CustomUserDetails userDetails) {
        ModelMapper mapper = new ModelMapper();
        Optional<Card> card = cardRepo.findById(id);
        CardDTO cardDTO = mapper.map(card.get(), CardDTO.class);

        if(userDetails != null) {
            User currentUser = userRepo.findByEmail(userDetails.getEmail());

            currentUser.getPortfolio().forEach(c -> {
                if(c.getTitle().equalsIgnoreCase(card.get().getTitle()) && c.getSubset().equalsIgnoreCase(card.get().getSubset())) {
                    cardDTO.setInPortfolio(true);
                }
            });
            currentUser.getWatchlist().forEach(c -> {
                if(c.getTitle().equalsIgnoreCase(card.get().getTitle()) && c.getSubset().equalsIgnoreCase(card.get().getSubset())) {
                    cardDTO.setWatched(true);
                }
            });
        }

        return cardDTO;
    }

    @Override
    public HashMap<Long, Double> totalPriceHistory(CustomUserDetails userDetails) {
        User user = userRepo.findByEmail(userDetails.getEmail());
        if(user == null) {
            return null;
            //throw
        }
        HashMap<Long, Double> priceHistory = new HashMap<>();
        user.getPortfolio().forEach(card -> {
            card.getPriceHistory().forEach((k, v) -> priceHistory.merge(k, v, (v1, v2) -> v1 + v2));
        });

        return priceHistory;
    }

    @Override
    public List<CardDTO> getTrendingCards(CustomUserDetails userDetails) {
        //logic to check if user has interacted with card'
        ModelMapper mapper = new ModelMapper();
        return Arrays.asList(mapper.map(cardRepo.findIfTrending(), CardDTO[].class));
    }

    @Override
    public List<CardDTO> getSuggestions(CustomUserDetails userDetails) {
        //logic here to determine cards a user might want to see depending on cards in their portfolio/watchlist
        ModelMapper mapper = new ModelMapper();
        if(userDetails == null) {
            return null;
        }

        User user = userRepo.findByEmail(userDetails.getEmail());

        List<Card> watchlist = user.getWatchlist();
        List<Card> portfolio = user.getPortfolio();
        List<Card> cardsOfInterest = Stream.of(watchlist, portfolio)
                .flatMap(Collection::stream)
                .collect(Collectors.toList());

        List<Card> suggestions = new LinkedList<>();
        List<String> prevQueries = new ArrayList<>();

        while(suggestions.size() < 20) {
            Card sugCard = null;
            String randomQuery = "";
            Random random = new Random();

            if(cardsOfInterest.size() <= 1) {
                while(suggestions.size() < 20) {
                    Optional<Card> randomCard = cardRepo.findById(random.nextLong(5000));
                    if(randomCard.isPresent()) {
                        suggestions.add(randomCard.get());
                    }
                }
            }

            Card originCard = cardsOfInterest.get(random.nextInt(cardsOfInterest.size()));
            Integer gate = random.nextInt(3);

            switch (gate) {
                case 0:
                    randomQuery = originCard.getTitle().substring(0, random.nextInt(originCard.getTitle().length()));

                    if(!prevQueries.contains(randomQuery)) {
                        prevQueries.add(randomQuery);
                        sugCard = cardRepo.querySuggested(randomQuery);
                    }

                    break;
                case 1:
                    randomQuery = originCard.getSubset().substring(0, random.nextInt(originCard.getSubset().length()));

                    if(!prevQueries.contains(randomQuery)) {
                        prevQueries.add(randomQuery);
                        sugCard = cardRepo.querySuggested(randomQuery);
                    }

                    break;
                case 2:
                    randomQuery = originCard.getRarity().substring(0, random.nextInt(originCard.getRarity().length()));

                    if(!prevQueries.contains(randomQuery)) {
                        prevQueries.add(randomQuery);
                        sugCard = cardRepo.querySuggested(randomQuery);
                    }

                    break;
            }

            if(sugCard != null && !suggestions.contains(sugCard) && !cardsOfInterest.contains(sugCard)) {
                suggestions.add(sugCard);
            }
        }

        ModelMapper sugMapper = new ModelMapper();

        return Arrays.asList(sugMapper.map(suggestions, CardDTO[].class));
    }
}
