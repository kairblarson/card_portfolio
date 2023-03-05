package com.portfolio.cardportfolio.controller;

import com.portfolio.cardportfolio.config.SecurityConfig;
import com.portfolio.cardportfolio.dto.CardDTO;
import com.portfolio.cardportfolio.dto.UserDTO;
import com.portfolio.cardportfolio.entity.CustomUserDetails;
import com.portfolio.cardportfolio.entity.User;
import com.portfolio.cardportfolio.repo.CardRepo;
import com.portfolio.cardportfolio.service.CardService;
import com.portfolio.cardportfolio.service.ScraperService;
import com.portfolio.cardportfolio.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.openqa.selenium.TimeoutException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

@RestController
@Slf4j
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.OPTIONS, RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE}, allowedHeaders = "*", allowCredentials = "true")
public class MainController {

    @Autowired
    private ScraperService scraperService;

    @Autowired
    private CardService cardService;

    @Autowired
    private UserService userService;

    @GetMapping("/test")
    public ResponseEntity<String> testConnection() {
        //tests the connection to make sure the server is running
        return ResponseEntity.ok().body("Connection successful");
    }

    @GetMapping("/session-id")
    public ResponseEntity<String> getSessionId() {
        System.out.println("Get session id");
        return ResponseEntity.ok().body("session acquired");
    }

    @GetMapping("/isAuth")
    public ResponseEntity<Object> isAuth() {
        return ResponseEntity.ok().body(SecurityContextHolder.getContext().getAuthentication().getPrincipal());
    }

    @GetMapping("/successful-login")
    public ResponseEntity<Object> successfulLogin() {
//        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok().body(String.valueOf("Success"));
    }

    @GetMapping("/successful-logout")
    public ResponseEntity<Object> successfulLogout(HttpSession session,
                                                   org.springframework.security.core.Authentication authentication,
                                                   HttpServletRequest request,
                                                   HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                cookie.setValue("");
                cookie.setPath("/");
                cookie.setMaxAge(0);
                response.addCookie(cookie);
            }
        }
        System.out.println("LOGOUT");
        return ResponseEntity.ok().body(HttpServletResponse.SC_ACCEPTED);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<List<UserDTO>> getDashboard() {

        return ResponseEntity.ok().body(null);
    }

    @GetMapping("/search")
    public ResponseEntity<List<CardDTO>> search(@RequestParam(value = "keyword") String keyword,
                                                @RequestParam(value = "deep", required = false) boolean deep,
                                                @RequestParam(value = "page", required = false) int page) { //change to return cardDTOs in the future
        //create method to search for cards
        List<CardDTO> res = new LinkedList<>();
        CustomUserDetails userDetails = null;

        if(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof UserDetails) {
            userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        }

        try{
            if(deep) {
                scraperService.scrape(keyword, 1, 5);
            }
            res = cardService.search(keyword, userDetails, page);
        } catch (TimeoutException e) {
            log.info("Process was stopped before page limit reached...");
            res = null;
        }

        return ResponseEntity.ok().body(res);
    }

    @GetMapping("/card/{id}")
    public ResponseEntity<CardDTO> viewCard(@PathVariable(name = "id") Long id) {
        CustomUserDetails userDetails = null;

        if(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof UserDetails) {
            userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        }

        return ResponseEntity.ok().body(cardService.viewCard(id, userDetails));
    }

    @PutMapping("/card/{id}/add/portfolio")
    public ResponseEntity<String> addToPortfolio(@PathVariable(name = "id") Long id) {
        CustomUserDetails userDetails = null;

        if(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof UserDetails) {
            userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        }

        return ResponseEntity.ok().body(userService.addCardToPortfolio(userDetails, id));
    }

    @PutMapping("/card/{id}/add/watchlist")
    public ResponseEntity<String> addToWatchlist(@PathVariable(name = "id") Long id) {
        CustomUserDetails userDetails = null;

        if(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof UserDetails) {
            userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        }

        return ResponseEntity.ok().body(userService.addCardToWatchlist(userDetails, id));
    }

    @GetMapping("/portfolio")
    public ResponseEntity<List<CardDTO>> getPortfolio(@RequestParam(name = "page") int page) {
        CustomUserDetails userDetails = null;

        if(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof UserDetails) {
            userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        }
        return ResponseEntity.ok().body(userService.getPortfolio(userDetails, page));
    }

    @GetMapping("/portfolio/graph")
    public ResponseEntity<HashMap<Long, Double>> getPortfolioGraph() {
        CustomUserDetails userDetails = null;

        if(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof UserDetails) {
            userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        }
        return ResponseEntity.ok().body(cardService.totalPriceHistory(userDetails));
    }

    @GetMapping("/watchlist")
    public ResponseEntity<List<CardDTO>> getWatchlist(@RequestParam(name = "page") int page) {
        CustomUserDetails userDetails = null;

        if(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof UserDetails) {
            userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        }
        return ResponseEntity.ok().body(userService.getWatchlist(userDetails, page));
    }

    @GetMapping("/portfolio/update")
    public ResponseEntity<List<CardDTO>> updatePortfolio() {
        CustomUserDetails userDetails = null;

        if(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof UserDetails) {
            userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        }
        return ResponseEntity.ok().body(userService.updatePortfolio(userDetails));
    }

    @GetMapping("/card/trending")
    public ResponseEntity<List<CardDTO>> getTrendingCards() {
        CustomUserDetails userDetails = null;

        if(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof UserDetails) {
            userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        }
        return ResponseEntity.ok().body(cardService.getTrendingCards(userDetails));
    }

    @GetMapping("/card/suggestions")
    public ResponseEntity<List<CardDTO>> getSuggestions() {
        CustomUserDetails userDetails = null;

        if(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof UserDetails) {
            userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        }

        return ResponseEntity.ok().body(cardService.getSuggestions(userDetails));
    }
    //make the dashboard look more user friendly, add chevrons to scroll the cards
    //use a diff algo to query cards similar to the one you clicked on
    //make the flame icon animated?
    //figure out a better way to delete the unwanted cards/misc
    //make the navbar cooler
    //allow user to signout
    //fix how cards look on mobile when vertically stacked
}
