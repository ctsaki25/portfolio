package com.portfolio.portfolio_backend.logiclayer;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Slf4j
@Service
public class FileStorageService {
    private final Path fileStorageLocation;
    private final String baseUrl;

    public FileStorageService(
            @Value("${file.upload-dir}") String uploadDir,
            @Value("${app.base-url}") String baseUrl) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.baseUrl = baseUrl;

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public Mono<String> storeFile(FilePart filePart) {
        // Generate unique filename
        String fileName = UUID.randomUUID().toString() + "_" + filePart.filename();
        Path targetLocation = this.fileStorageLocation.resolve(fileName);

        log.info("Storing file: {} at location: {}", fileName, targetLocation);

        return filePart.transferTo(targetLocation)
                .then(Mono.just(baseUrl + "/api/v1/projects/images/" + fileName))
                .doOnSuccess(url -> log.info("Successfully stored file. URL: {}", url));
    }

    public Mono<Resource> loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if(resource.exists()) {
                return Mono.just(resource);
            } else {
                return Mono.error(new RuntimeException("File not found: " + fileName));
            }
        } catch (MalformedURLException ex) {
            return Mono.error(new RuntimeException("File not found: " + fileName, ex));
        }
    }
}