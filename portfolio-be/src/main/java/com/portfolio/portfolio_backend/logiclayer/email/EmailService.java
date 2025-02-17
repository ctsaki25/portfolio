package com.portfolio.portfolio_backend.logiclayer.email;

import com.portfolio.portfolio_backend.presentationlayer.email.EmailRequestModel;

public interface EmailService {
    void sendEmail(EmailRequestModel emailRequest);
} 