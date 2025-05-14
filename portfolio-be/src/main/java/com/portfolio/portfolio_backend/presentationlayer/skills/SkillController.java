package com.portfolio.portfolio_backend.presentationlayer.skills;

import com.portfolio.portfolio_backend.logiclayer.skills.SkillService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource; // For potential future use if serving files directly via controller
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/api/v1/skills")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8080", "http://157.230.70.214"}) // Added prod IP
public class SkillController {

    private final SkillService skillService;

    @GetMapping("/admin")
    public Flux<SkillResponseModel> getAllSkillsAdmin() {
        log.info("Received request to get all skills (admin)");
        return skillService.getAllSkillsAdmin();
    }

    @GetMapping("/public") // Or just @GetMapping if this is the default
    public Flux<SkillResponseModel> getAllSkillsPublic() {
        log.info("Received request to get all skills (public)");
        return skillService.getAllSkillsPublic();
    }

    @GetMapping("/{skillId}")
    public Mono<SkillResponseModel> getSkillById(@PathVariable String skillId) {
        log.info("Received request to get skill by id: {}", skillId);
        return skillService.getSkillById(skillId);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<SkillResponseModel> createSkill(@RequestBody Mono<SkillRequestModel> skillRequestModelMono) {
        log.info("Received request to create a new skill.");
        return skillService.createSkill(skillRequestModelMono);
    }

    @PutMapping(value = "/{skillId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Mono<SkillResponseModel> updateSkill(@PathVariable String skillId,
                                                 @RequestBody Mono<SkillRequestModel> skillRequestModelMono) {
        log.info("Received request to update skill with id: {}", skillId);
        return skillService.updateSkill(skillId, skillRequestModelMono);
    }

    @DeleteMapping("/{skillId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> deleteSkill(@PathVariable String skillId) {
        log.info("Received request to delete skill with id: {}", skillId);
        return skillService.deleteSkill(skillId);
    }
    
    // Note: The generic file serving endpoint /api/v1/files/{subdirectory}/{filename} 
    // is assumed to be handled by another controller (e.g., FileController or directly via static resource mapping if applicable)
    // For example, if ProjectController has /images/{fileName}, a similar one for skills could be here
    // or a more generic one in a dedicated FileController that FileStorageService uses to build URLs.
    // For now, SkillServiceImpl constructs URLs pointing to /api/v1/files/ which needs a handler.
} 