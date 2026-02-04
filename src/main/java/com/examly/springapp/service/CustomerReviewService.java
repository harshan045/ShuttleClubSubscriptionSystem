package com.examly.springapp.service;

import com.examly.springapp.model.CustomerReview;
import com.examly.springapp.repository.CustomerReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerReviewService {
    @Autowired
    private CustomerReviewRepository repository;

    public CustomerReview createReview(CustomerReview review) {
        return repository.save(review);
    }

    public List<CustomerReview> getAllReviews() {
        return repository.findAll();
    }

    public Optional<CustomerReview> getReviewById(Long id) {
        return repository.findById(id);
    }
}
