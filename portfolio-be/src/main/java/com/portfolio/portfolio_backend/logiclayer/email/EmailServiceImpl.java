package com.portfolio.portfolio_backend.logiclayer.email;

import com.portfolio.portfolio_backend.presentationlayer.email.EmailRequestModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender emailSender;

    @Override
    @Async
    public void sendEmail(EmailRequestModel emailRequest) {
        try {
            log.info("Starting to send email from: {}", emailRequest.getEmail());
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(emailRequest.getEmail());
            message.setTo("ctsaki25@gmail.com"); 
            message.setSubject("Portfolio Contact: " + emailRequest.getSubject());
            message.setText(
                "Name: " + emailRequest.getName() + "\n" +
                "Email: " + emailRequest.getEmail() + "\n" +
                "Message: " + emailRequest.getMessage()
            );
            
            emailSender.send(message);
            log.info("Email sent successfully from: {}", emailRequest.getEmail());
        } catch (Exception e) {
            log.error("Failed to send email: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }
} 