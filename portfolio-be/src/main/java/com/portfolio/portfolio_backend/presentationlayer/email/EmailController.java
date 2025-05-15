package com.portfolio.portfolio_backend.presentationlayer.email;

import com.portfolio.portfolio_backend.logiclayer.email.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/email")
@CrossOrigin(origins = "*")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(@RequestBody EmailRequestModel emailRequest) {
        try {
            log.info("Received email request from: {}", emailRequest.getEmail());
            
            // Validate input
            if (emailRequest.getEmail() == null || emailRequest.getEmail().isEmpty()) {
                return new ResponseEntity<>("Email address is required", HttpStatus.BAD_REQUEST);
            }
            
            emailService.sendEmail(emailRequest);
            
            // Since email sending is async, we can return immediately
            return new ResponseEntity<>("Email request received and is being processed", HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error in email controller: {}", e.getMessage(), e);
            return new ResponseEntity<>("Failed to process email request: " + e.getMessage(), 
                                     HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 