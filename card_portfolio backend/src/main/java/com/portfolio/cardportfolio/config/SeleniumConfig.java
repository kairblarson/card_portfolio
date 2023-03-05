package com.portfolio.cardportfolio.config;

import jakarta.annotation.PostConstruct;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SeleniumConfig {

    @PostConstruct
    void postConstruct() {
        System.setProperty("webdriver.chrome.driver", "/Users/kairb/Desktop/chrome_driver/chromedriver.exe");
    }

    @Bean
    public ChromeDriver driver() {
        final ChromeOptions chromeOptions = new ChromeOptions();
        chromeOptions.addArguments("--headless");
        return new ChromeDriver(chromeOptions);
    }
}
