package com.portfolio.portfolio_backend.utils;

import com.portfolio.portfolio_backend.datalayer.projects.Project;
import com.portfolio.portfolio_backend.datalayer.projects.ProjectComment;
import com.portfolio.portfolio_backend.datalayer.projects.ProjectRepository;
import com.portfolio.portfolio_backend.datalayer.projects.ProjectCommentRepository;
import com.portfolio.portfolio_backend.datalayer.testimonials.Testimonial;
import com.portfolio.portfolio_backend.datalayer.testimonials.TestimonialRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;

@Profile("!production")
@Service
public class DataLoaderService implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataLoaderService.class);

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectCommentRepository commentRepository;

    @Autowired
    private TestimonialRepository testimonialRepository;

    private void tearDown() {
        projectRepository.deleteAll().subscribe();
        commentRepository.deleteAll().subscribe();
        testimonialRepository.deleteAll().subscribe();
    }

    @Override
    public void run(String... args) {
        log.info("Starting data loader...");

        List<Project> projects = Arrays.asList(
                Project.builder()
                        .projectId("proj-1")
                        .title("Champlain Pet Clinic Web App")
                        .description("A full-stack simulation of a pet clinic")
                        .imageUrl("/images/petclinic.png")
                        .technologies("React, Spring Boot, MongoDB")
                        .githubUrl("https://github.com/cgerard321/champlain_petclinic")
                        .liveUrl("")
                        .published(true)
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .build(),
                Project.builder()
                        .projectId("proj-2")
                        .title("LVH Lion Dance Web App")
                        .description("A full-stack platform for a martial arts school")
                        .imageUrl("/images/liondance.png")
                        .technologies("Angular, Java, MongoDB")
                        .githubUrl("https://github.com/viktorkuts/liondance")
                        .liveUrl("https://fe.dev.kleff.io")
                        .published(true)
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .build(),
                Project.builder()
                        .projectId("proj-3")
                        .title("Zombie Apocalypse Game")
                        .description("A 2D zombie survival game")
                        .imageUrl("/images/zombies.webp")
                        .technologies("Unity, C#, Photoshop")
                        .githubUrl("https://github.com/Youssefchahboune/GameProjectWinter2023")
                        .liveUrl("")
                        .published(true)
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .build()
        );

        List<ProjectComment> comments = Arrays.asList(
                ProjectComment.builder()
                        .commentId("com-1")
                        .projectId("proj-1")
                        .authorName("John Doe")
                        .authorEmail("john@example.com")
                        .content("Great project!")
                        .approved(true)
                        .createdAt(Instant.now())
                        .build(),
                ProjectComment.builder()
                        .commentId("com-2")
                        .projectId("proj-1")
                        .authorName("Jane Smith")
                        .authorEmail("jane@example.com")
                        .content("Amazing work!")
                        .approved(false)
                        .createdAt(Instant.now())
                        .build()
        );

        List<Testimonial> testimonials = Arrays.asList(
                Testimonial.builder()
                        .testimonialId("test-1")
                        .name("Sarah Johnson")
                        .title("Senior Developer at TechCorp")
                        .content("Constantine is an exceptional developer who consistently delivers high-quality work. His attention to detail and problem-solving skills are outstanding.")
                        .stars(5)
                        .approved(true)
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .build(),
                Testimonial.builder()
                        .testimonialId("test-2")
                        .name("Michael Chen")
                        .title("Project Manager at InnovateSoft")
                        .content("Working with Constantine was a pleasure. His technical expertise and ability to communicate complex ideas clearly made our project a success.")
                        .stars(5)
                        .approved(true)
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .build(),
                Testimonial.builder()
                        .testimonialId("test-3")
                        .name("Emily Rodriguez")
                        .title("Tech Lead at WebSolutions")
                        .content("Constantine's dedication to writing clean, maintainable code and his collaborative approach make him an invaluable team member.")
                        .stars(5)
                        .approved(true)
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .build(),
                Testimonial.builder()
                        .testimonialId("test-4")
                        .name("David Kim")
                        .title("CTO at StartupX")
                        .content("Pending approval testimonial - Constantine brings innovative solutions to every project he touches.")
                        .stars(4)
                        .approved(false)
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .build()
        );

        log.info("Created {} testimonials to load", testimonials.size());
        
        tearDown();

        // First delete all existing data and wait for completion
        Mono.when(
            projectRepository.deleteAll(),
            commentRepository.deleteAll(),
            testimonialRepository.deleteAll()
        )
        .then(
            // Then insert all new data and wait for completion
            Mono.when(
                projectRepository.saveAll(projects).then(),
                commentRepository.saveAll(comments).then(),
                testimonialRepository.saveAll(testimonials)
                    .doOnComplete(() -> log.info("Successfully loaded {} testimonials", testimonials.size()))
                    .doOnError(error -> log.error("Error loading testimonials: {}", error.getMessage()))
                    .then()
            )
        )
        .block(); // Wait for all operations to complete

        log.info("Data loader completed");
    }
}