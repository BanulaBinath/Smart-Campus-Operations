package com.example.smart_campus_operations;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmartCampusOperationsApplication {

	public static void main(String[] args) {
		io.github.cdimascio.dotenv.Dotenv dotenv = io.github.cdimascio.dotenv.Dotenv.configure()
				.ignoreIfMissing()
				.load();
		
		dotenv.entries().forEach(entry -> {
			System.setProperty(entry.getKey(), entry.getValue());
		});

		SpringApplication.run(SmartCampusOperationsApplication.class, args);
	}

	@org.springframework.context.annotation.Bean
	public org.springframework.boot.CommandLineRunner schemaUpdater(org.springframework.jdbc.core.JdbcTemplate jdbcTemplate) {
		return args -> {
			try {
				jdbcTemplate.execute("ALTER TABLE notifications MODIFY COLUMN type VARCHAR(255)");
				System.out.println("Successfully updated notifications type column to VARCHAR(255)");
			} catch (Exception e) {
				System.err.println("Could not alter notifications table, might already be updated or table doesn't exist: " + e.getMessage());
			}
		};
	}

	@org.springframework.context.annotation.Bean
	public org.springframework.boot.CommandLineRunner adminSeeder(
			com.example.smart_campus_operations.repository.UserRepository userRepository,
			org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
		return args -> {
			String adminEmail = "admin@sliit.edu";
			if (userRepository.findByEmail(adminEmail).isEmpty()) {
				com.example.smart_campus_operations.entity.AppUser admin = com.example.smart_campus_operations.entity.AppUser.builder()
						.name("System Administrator")
						.email(adminEmail)
						.password(passwordEncoder.encode("admin123"))
						.role(com.example.smart_campus_operations.entity.Role.ADMIN)
						.provider("SYSTEM")
						.build();
				userRepository.save(admin);
				System.out.println("Default admin user created. Email: " + adminEmail + " | Password: admin123");
			} else {
				System.out.println("Admin user already exists.");
			}
		};
	}

}
