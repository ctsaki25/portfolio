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

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
            log.info("File storage location initialized at: {}", this.fileStorageLocation);
        } catch (IOException ex) {
            log.error("Could not create the directory for uploads: {}", this.fileStorageLocation, ex);
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    /**
     * Stores a file with a unique name directly in the fileStorageLocation.
     * @param filePart The file part to store.
     * @return A Mono containing the unique name of the stored file (e.g., "unique_filename.ext").
     */
    public Mono<String> storeFile(FilePart filePart) {
        String originalFileName = filePart.filename();
        String fileExtension = "";
        int lastDot = originalFileName.lastIndexOf('.');
        if (lastDot > 0 && lastDot < originalFileName.length() - 1) {
            fileExtension = originalFileName.substring(lastDot);
        }
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
        
        Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName).normalize();

        log.info("Attempting to store file: {} (original: {}) at: {}", uniqueFileName, originalFileName, targetLocation);

        return filePart.transferTo(targetLocation)
                .then(Mono.just(uniqueFileName))
                .doOnSuccess(fileName -> log.info("Successfully stored file. Filename: {}", fileName))
                .doOnError(e -> log.error("Failed to store file {} at {}: {}", uniqueFileName, targetLocation, e.getMessage()));
    }

    /**
     * Loads a file as a resource from the fileStorageLocation.
     * @param filename The name of the file (e.g., "filename.ext").
     * @return A Mono containing the resource, or an error if not found.
     */
    public Mono<Resource> loadFileAsResource(String filename) {
        try {
            Path filePath = this.fileStorageLocation.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return Mono.just(resource);
            } else {
                log.warn("File not found or not readable: {}", filename);
                return Mono.error(new RuntimeException("File not found: " + filename));
            }
        } catch (MalformedURLException ex) {
            log.error("Malformed URL for path: {}", filename, ex);
            return Mono.error(new RuntimeException("File not found (malformed URL): " + filename, ex));
        } catch (Exception ex) {
            log.error("Error loading file as resource: {}", filename, ex);
            return Mono.error(new RuntimeException("Could not load file: " + filename, ex));
        }
    }
}