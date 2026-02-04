package com.examly.springapp;

import com.examly.springapp.model.MembershipType;
import com.examly.springapp.model.User;
import com.examly.springapp.model.Subscription;
import com.examly.springapp.model.Payment;
import com.examly.springapp.repository.MembershipTypeRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.SubscriptionRepository;
import com.examly.springapp.repository.PaymentRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SpringappApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringappApplication.class, args);
        System.out.println("Application started successfully.");
    }

    @Bean
    public CommandLineRunner seedData(
            MembershipTypeRepository typeRepo,
            UserRepository userRepo,
            SubscriptionRepository subRepo,
            PaymentRepository payRepo,
            com.examly.springapp.repository.AttendanceRepository attendRepo) {
        return args -> {
            // Check if data exists before seeding
            if (!userRepo.findByEmail("admin@shuttle.com").isPresent()) {
                // Seed Plans
                MembershipType basic = typeRepo.save(new MembershipType(null, "Basic", 29.99, 1));
                MembershipType premium = typeRepo.save(new MembershipType(null, "Premium", 79.99, 3));
                MembershipType elite = typeRepo.save(new MembershipType(null, "Elite", 149.99, 6));

                // Seed Admin User
                User admin = userRepo.save(
                        new User(null, "Admin", "admin@shuttle.com", "0000000000", "admin123", "ADMIN", null, null));

                // Seed Attendance
                com.examly.springapp.model.Attendance a1 = new com.examly.springapp.model.Attendance(null, admin,
                        "2024-02-01", "10:00 AM", "12:00 PM");
                com.examly.springapp.model.Attendance a2 = new com.examly.springapp.model.Attendance(null, admin,
                        "2024-02-02", "09:30 AM", "11:30 AM");
                attendRepo.saveAll(java.util.List.of(a1, a2));

                System.out.println("Default data (Admin, Plans, Attendance) seeded.");
            } else {
                System.out.println("Data already exists. Skipping seed.");
            }
        };
    }
}
