package com.examly.springapp.service;

import com.examly.springapp.model.Subscription;
import com.examly.springapp.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {
    @Autowired
    private SubscriptionRepository subscriptionRepository;

    public Subscription createSubscription(Subscription subscription) {
        return subscriptionRepository.save(subscription);
    }

    public List<Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }

    public Optional<Subscription> getSubscriptionById(Long id) {
        return subscriptionRepository.findById(id);
    }

    public Subscription updateSubscription(Long id, Subscription details) {
        Subscription sub = subscriptionRepository.findById(id).orElseThrow();
        sub.setStartDate(details.getStartDate());
        sub.setEndDate(details.getEndDate());
        sub.setStatus(details.getStatus());
        sub.setUser(details.getUser());
        sub.setMembershipType(details.getMembershipType());
        return subscriptionRepository.save(sub);
    }

    public List<Subscription> getSubscriptionsByName(String name) {
        return subscriptionRepository.findAll().stream()
                .filter(s -> s.getMembershipType().getTypeName().equalsIgnoreCase(name))
                .collect(Collectors.toList());
    }

    public List<Subscription> getSubscriptionsByPriceRange(Double min, Double max) {
        return subscriptionRepository.findAll().stream()
                .filter(s -> s.getMembershipType().getPrice() >= min && s.getMembershipType().getPrice() <= max)
                .collect(Collectors.toList());
    }

    public List<Subscription> getSubscriptionsByDurationGreater(Integer months) {
        return subscriptionRepository.findAll().stream()
                .filter(s -> s.getMembershipType().getDurationInMonths() > months)
                .collect(Collectors.toList());
    }

    public List<Subscription> getSubscriptionsByPriceLess(Double price) {
        return subscriptionRepository.findAll().stream()
                .filter(s -> s.getMembershipType().getPrice() < price)
                .collect(Collectors.toList());
    }

    public List<Subscription> getSubscriptionsByUserId(Long userId) {
        return subscriptionRepository.findAll().stream()
                .filter(s -> s.getUser() != null && s.getUser().getUserId().equals(userId))
                .collect(Collectors.toList());
    }

    public Subscription toggleStatus(Long id) {
        Subscription sub = subscriptionRepository.findById(id).orElseThrow();
        if ("Active".equalsIgnoreCase(sub.getStatus())) {
            sub.setStatus("Inactive");
        } else {
            sub.setStatus("Active");
        }
        return subscriptionRepository.save(sub);
    }
}
