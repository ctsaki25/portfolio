package com.portfolio.portfolio_backend.logiclayer.email;

import com.portfolio.portfolio_backend.presentationlayer.email.EmailRequestModel;
import org.springframework.scheduling.annotation.Async;

public interface EmailService {
    @Async
    void sendEmail(EmailRequestModel emailRequest);
} 