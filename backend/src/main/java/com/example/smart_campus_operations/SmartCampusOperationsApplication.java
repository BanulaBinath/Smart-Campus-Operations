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
			String adminEmail = "banulabinath.edu@gmail.com";
			String legacyAdminEmail = "banula@gmail.com";
			String adminPassword = "@Banula123";

			java.util.Optional<com.example.smart_campus_operations.entity.AppUser> existingAdmin = userRepository.findByEmailIgnoreCase(adminEmail);
			com.example.smart_campus_operations.entity.AppUser admin;

			if (existingAdmin.isPresent()) {
				admin = existingAdmin.get();
			} else {
				java.util.Optional<com.example.smart_campus_operations.entity.AppUser> legacyAdmin = userRepository.findByEmailIgnoreCase(legacyAdminEmail);
				if (legacyAdmin.isPresent()) {
					admin = legacyAdmin.get();
					admin.setEmail(adminEmail);
					System.out.println("Migrated admin email from " + legacyAdminEmail + " to " + adminEmail);
				} else {
					admin = com.example.smart_campus_operations.entity.AppUser.builder()
							.name("Admin")
							.email(adminEmail)
							.role(com.example.smart_campus_operations.entity.Role.ADMIN)
							.provider("SYSTEM")
							.build();
					System.out.println("Default admin user created. Email: " + adminEmail);
				}
			}

			boolean passwordMatches = admin.getPassword() != null && passwordEncoder.matches(adminPassword, admin.getPassword());
			if (!passwordMatches) {
				admin.setPassword(passwordEncoder.encode(adminPassword));
			}

			admin.setName("Admin");
			admin.setRole(com.example.smart_campus_operations.entity.Role.ADMIN);
			if (admin.getProvider() == null || admin.getProvider().isBlank()) {
				admin.setProvider("SYSTEM");
			}

			userRepository.save(admin);
			System.out.println("Default admin user verified/updated. Email: " + adminEmail);
		};
	}

}
