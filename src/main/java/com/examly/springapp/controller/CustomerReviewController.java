package com.examly.springapp.controller;

import com.examly.springapp.model.CustomerReview;
import com.examly.springapp.service.CustomerReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/customer-reviews")
public class CustomerReviewController {
    @Autowired
    private CustomerReviewService service;

    @PostMapping
    public CustomerReview createReview(@RequestBody CustomerReview review) {
        return service.createReview(review);
    }

    @GetMapping
    public List<CustomerReview> getAllReviews() {
        return service.getAllReviews();
    }

    @GetMapping("/{id}")
    public CustomerReview getReviewById(@PathVariable Long id) {
        return service.getReviewById(id).orElse(null);
    }
}
