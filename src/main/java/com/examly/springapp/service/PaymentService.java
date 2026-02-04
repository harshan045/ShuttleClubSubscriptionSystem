package com.examly.springapp.service;

import com.examly.springapp.model.Payment;
import com.examly.springapp.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentsByUserId(Long userId) {
        return paymentRepository.findAll().stream()
                .filter(p -> p.getUser() != null && p.getUser().getUserId().equals(userId))
                .collect(Collectors.toList());
    }

    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }
}
