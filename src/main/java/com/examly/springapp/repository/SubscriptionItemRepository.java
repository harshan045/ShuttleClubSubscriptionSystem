package com.examly.springapp.repository;

import com.examly.springapp.model.SubscriptionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscriptionItemRepository extends JpaRepository<SubscriptionItem, Long> {
}
