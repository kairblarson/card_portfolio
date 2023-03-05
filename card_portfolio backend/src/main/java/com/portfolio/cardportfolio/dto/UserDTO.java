package com.portfolio.cardportfolio.dto;

import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class UserDTO {

    private String email;
    private String role;
    private List<CardDTO> portfolio;
    private List<CardDTO> watchlist;
}
