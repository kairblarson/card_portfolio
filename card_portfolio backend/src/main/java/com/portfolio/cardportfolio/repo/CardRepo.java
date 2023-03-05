package com.portfolio.cardportfolio.repo;

import com.portfolio.cardportfolio.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardRepo extends JpaRepository<Card, Long> {

    Card findByTitleAndRarity(String title, String rarity);
    List<Card> findByTitle(String title);
    Card findByTitleAndRarityAndSubset(String title, String rarity, String subset);
    @Query(value = "SELECT * FROM card c WHERE c.title LIKE %:keyword% OR c.subset LIKE %:keyword% ORDER BY RAND() LIMIT 200", nativeQuery = true) //change in future
    List<Card> queryCards(@Param("keyword") String keyword);
    @Query(value = "SELECT * FROM card c WHERE c.is_trending=true ORDER BY RAND() LIMIT 200", nativeQuery = true)
    List<Card> findIfTrending();
    @Query(value = "SELECT * FROM card c WHERE c.title LIKE %:keyword% OR c.subset LIKE %:keyword% OR c.rarity LIKE %:keyword% ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Card querySuggested(@Param("keyword") String keyword);
}
