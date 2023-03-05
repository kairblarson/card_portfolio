package com.portfolio.cardportfolio.service;

import com.portfolio.cardportfolio.entity.Card;
import com.portfolio.cardportfolio.repo.CardRepo;
import com.portfolio.cardportfolio.util.TreeMapMapper;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.util.*;

@Service
@AllArgsConstructor
@Slf4j
public class ScraperService {

    private static String url = "https://www.tcgplayer.com/search/pokemon/product?productLineName=pokemon&q=(KEYWORD)&view=grid&ProductTypeName=Cards&page=(PAGE)";

    private final ChromeDriver driver;

    @Autowired
    private CardRepo cardRepo;

//    @PostConstruct
//    void postConstruct() {
//        scrape("pokemon");
//    }

    public String scrape(final String value, int intPage, int maxPage) throws TimeoutException {

            url = url.replace("(KEYWORD)", value.contains(" ") ? value.replace(" ", "+") : value);
            url = url.replace("(PAGE)", String.valueOf(intPage));
            url = url.replace("(", "");
            url = url.replace(")", "");
            url = url.replace("-", "");

            System.out.println("URL: "+url);

            driver.get(url);
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(3));

            WebElement marketplace;
            List<WebElement> results;

            try{
                marketplace = wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("search-results")));
                results = marketplace.findElements(By.className("search-result"));
            } catch (TimeoutException e) {
                url = "https://www.tcgplayer.com/search/pokemon/product?productLineName=pokemon&q=(KEYWORD)&view=grid&ProductTypeName=Cards&page=(PAGE)";

                log.info("Process was stopped before page limit reached... URL has been reset to: "+url);

                return "Process was stopped before page limit reached...";
            }

            results.forEach(product -> {
                Card card = new Card();

                try {
                    wait.until(ExpectedConditions.visibilityOfNestedElementsLocatedBy(product, By.className("search-result__title")));
                    card.setTitle(product.findElement(By.className("search-result__title")).getText());
                } catch (Exception e) {
                    log.info("No title found for UNKNOWN");
                    card.setTitle("N/A");
                }

                try {
                    wait.until(ExpectedConditions.visibilityOfNestedElementsLocatedBy(product, By.className("search-result__market-price--value")));
                    card.setMarketPrice(Double.parseDouble(product.findElement(By.className("search-result__market-price--value")).getText().substring(1)));
                    card.addToPriceHistory(card.getMarketPrice());
//                    System.out.println("HISTORY: "+card.getPriceHistory());
                } catch (Exception e) {
                    log.info("No market price found for "+product.findElement(By.className("search-result__title")).getText());
                    card.setMarketPrice(0.00); //if price == 0 then no market price was found
                }

                try {
                    wait.until(ExpectedConditions.visibilityOfNestedElementsLocatedBy(product, By.className("search-result__subtitle")));
                    card.setSubset(product.findElement(By.className("search-result__subtitle")).getText());
                } catch (Exception e) {
                    log.info("No subset found for "+product.findElement(By.className("search-result__title")).getText());
                    card.setSubset("N/A");
                }

                try {
                    wait.until(ExpectedConditions.visibilityOfNestedElementsLocatedBy(product, By.cssSelector(".v-lazy-image")));
                    card.setImage(product.findElement(By.cssSelector(".v-lazy-image")).getAttribute("src"));
                } catch (Exception e) {
                    log.info("No image found for "+product.findElement(By.className("search-result__title")).getText());
                    card.setImage("N/A");
                }

                try {
                    wait.until(ExpectedConditions.visibilityOfNestedElementsLocatedBy(product, By.className("search-result__rarity")));
                    card.setRarity(product.findElement(By.className("search-result__rarity")).getText());
                } catch (Exception e) {
                    log.info("No rarity found for "+product.findElement(By.className("search-result__title")).getText());
                    card.setRarity("N/A");
                }

                card.setCategory("pokemon");

                Long date = new Date().getTime();
                Calendar calendar = Calendar.getInstance();
                calendar.setTimeInMillis(date);

                Optional<Card> optionalCard = Optional.ofNullable(cardRepo.findByTitleAndRarityAndSubset(card.getTitle(), card.getRarity(), card.getSubset()));

                if(optionalCard.isEmpty()) {
                    card.setLastUpdated(new SimpleDateFormat("MMM").format(calendar.getTime())+"-"+calendar.get(Calendar.DAY_OF_MONTH)+"-"+calendar.get(Calendar.YEAR));
                    log.info("Saving... "+card.getTitle());
                    cardRepo.save(card);
                }
                else if(card.getTitle().equalsIgnoreCase("N/A")) {
                    log.info("Card not saved...");
                }
                else {
                    //save updated info about card, do not create new instance
                    Card existingCard = optionalCard.get();
                    existingCard.setMarketPrice(card.getMarketPrice());
                    existingCard.setTitle(card.getTitle());
                    existingCard.setImage(card.getImage());
                    existingCard.setCategory(card.getCategory());
                    existingCard.setRarity(card.getRarity());
                    existingCard.setSubset(card.getSubset());
                    existingCard.addToPriceHistory(card.getMarketPrice());

                    Map<Long, Double> sortedHistory = TreeMapMapper.convertToTreeMap(existingCard.getPriceHistory());
                    List<Double> prevPrices = sortedHistory.values().stream().toList();

                    if(prevPrices.size() > 1) {
                        if(existingCard.getMarketPrice() > prevPrices.get(prevPrices.size()-2)*1.05 && existingCard.getMarketPrice() >= 3) { //if card has increased by over 5% it is hot/trending
                            existingCard.setTrending(true);
                            System.out.println(existingCard.getTitle()+": "+existingCard.getSubset()+" is trending");
                        }
                        else {
                            existingCard.setTrending(false);
                        }
                    }
                    else {
                        existingCard.setTrending(false);
                    }

                    existingCard.setLastUpdated(new SimpleDateFormat("MMM").format(calendar.getTime())+"-"+calendar.get(Calendar.DAY_OF_MONTH)+"-"+calendar.get(Calendar.YEAR));

                    log.info("Updating... "+card.getTitle());
                    cardRepo.save(existingCard);
                }
            });

            url = "https://www.tcgplayer.com/search/pokemon/product?productLineName=pokemon&q=(KEYWORD)&view=grid&ProductTypeName=Cards&page=(PAGE)";

            if(intPage < maxPage) { //change this to 200 for prod
                scrape(value, intPage+1, maxPage);
            }
        log.info("Process has ended...");
            //this method is probably the best place to determine if a card is trending or not by comparing its prev price with cur price
            //have like a biggest losers and biggest winners over the last week or so
        return "success";
    }

    @Scheduled(cron = "0 0 4 * * ?")
    public void scheduledScrape() {
        log.info("Initiating daily scrape: "+new Date());
        String res = scrape("pokemon", 1, 200);
        log.info("Daily scrape completed:  "+new Date());
    }

}
//        driver.quit();