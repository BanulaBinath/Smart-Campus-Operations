package com.example.smart_campus_operations;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.smart_campus_operations.repository.UserRepository;
import com.example.smart_campus_operations.entity.AppUser;
import com.example.smart_campus_operations.entity.Role;

@SpringBootApplication
public class SmartCampusOperationsApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmartCampusOperationsApplication.class, args);
	}

	@Bean
	public CommandLineRunner schemaUpdater(JdbcTemplate jdbcTemplate) {
		return args -> {
			try {
				jdbcTemplate.execute("ALTER TABLE notifications MODIFY COLUMN type VARCHAR(255)");
				System.out.println("Successfully updated notifications type column to VARCHAR(255)");
			} catch (Exception e) {
				System.err.println("Could not alter notifications table: " + e.getMessage());
			}
		};
	}

	@Bean
	public CommandLineRunner adminSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			String adminEmail = "admin@sliit.edu";
			if (userRepository.findByEmail(adminEmail).isEmpty()) {
				AppUser admin = AppUser.builder()
						.name("System Administrator")
						.email(adminEmail)
						.password(passwordEncoder.encode("admin123"))
						.role(Role.ADMIN)
						.provider("SYSTEM")
						.build();
				userRepository.save(admin);
				System.out.println("Default admin created: " + adminEmail);
			} else {
				System.out.println("Admin already exists.");
			}
		};
	}
}