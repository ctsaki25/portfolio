package com.portfolio.portfolio_backend.presentationlayer.email;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmailRequestModel {
    private String name;
    private String email;
    private String subject;
    private String message;
} 