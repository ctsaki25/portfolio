package com.portfolio.portfolio_backend.logiclayer.email;

import com.portfolio.portfolio_backend.presentationlayer.email.EmailRequestModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender emailSender;

    @Override
    public void sendEmail(EmailRequestModel emailRequest) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(emailRequest.getEmail());
        message.setTo("ctsaki25@gmail.com"); // Replace with your email
        message.setSubject("Portfolio Contact: " + emailRequest.getSubject());
        message.setText(
            "Name: " + emailRequest.getName() + "\n" +
            "Email: " + emailRequest.getEmail() + "\n" +
            "Message: " + emailRequest.getMessage()
        );
        
        emailSender.send(message);
    }
} 