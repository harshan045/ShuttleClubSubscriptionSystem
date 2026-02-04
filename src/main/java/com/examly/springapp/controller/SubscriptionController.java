package com.examly.springapp.controller;

import com.examly.springapp.model.Subscription;
import com.examly.springapp.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {
    @Autowired
    private SubscriptionService subscriptionService;

    @PostMapping
    public Subscription createSubscription(@RequestBody Subscription subscription) {
        return subscriptionService.createSubscription(subscription);
    }

    @GetMapping
    public List<Subscription> getAllSubscriptions() {
        return subscriptionService.getAllSubscriptions();
    }

    @GetMapping("/{id}")
    public Subscription getSubscriptionById(@PathVariable Long id) {
        return subscriptionService.getSubscriptionById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Subscription updateSubscription(@PathVariable Long id, @RequestBody Subscription details) {
        return subscriptionService.updateSubscription(id, details);
    }

    @GetMapping("/name/{name}")
    public List<Subscription> getSubscriptionsByName(@PathVariable String name) {
        return subscriptionService.getSubscriptionsByName(name);
    }

    @GetMapping("/price")
    public List<Subscription> getSubscriptionsByPriceRange(@RequestParam Double min, @RequestParam Double max) {
        return subscriptionService.getSubscriptionsByPriceRange(min, max);
    }

    @GetMapping("/duration-greater/{months}")
    public List<Subscription> getSubscriptionsByDurationGreater(@PathVariable Integer months) {
        return subscriptionService.getSubscriptionsByDurationGreater(months);
    }

    @GetMapping("/price-less/{price}")
    public List<Subscription> getSubscriptionsByPriceLess(@PathVariable Double price) {
        return subscriptionService.getSubscriptionsByPriceLess(price);
    }

    @GetMapping("/user/{userId}")
    public List<Subscription> getSubscriptionsByUserId(@PathVariable Long userId) {
        return subscriptionService.getSubscriptionsByUserId(userId);
    }

    @PutMapping("/{id}/toggle")
    public Subscription toggleSubscriptionStatus(@PathVariable Long id) {
        return subscriptionService.toggleStatus(id);
    }
}
