package com.portfolio.portfolio_backend.presentationlayer;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/images")
public class ImageController {
    
    @GetMapping("/{imageName}")
    public Mono<ResponseEntity<Resource>> getImage(@PathVariable String imageName) {
        try {
            Resource resource = new ClassPathResource("static/images/" + imageName);
            
            if (resource.exists()) {
                // Determine content type based on file extension
                String contentType = determineContentType(imageName);
                
                return Mono.just(ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource));
            } else {
                return Mono.just(ResponseEntity.notFound().build());
            }
        } catch (Exception e) {
            return Mono.just(ResponseEntity.notFound().build());
        }
    }

    private String determineContentType(String filename) {
        if (filename.endsWith(".webp")) {
            return "image/webp";
        } else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (filename.endsWith(".png")) {
            return "image/png";
        } else if (filename.endsWith(".gif")) {
            return "image/gif";
        }
        return "application/octet-stream";
    }
} 