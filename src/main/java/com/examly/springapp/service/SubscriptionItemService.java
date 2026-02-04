package com.examly.springapp.service;

import com.examly.springapp.model.SubscriptionItem;
import com.examly.springapp.repository.SubscriptionItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SubscriptionItemService {
    @Autowired
    private SubscriptionItemRepository repository;

    public SubscriptionItem createItem(SubscriptionItem item) {
        return repository.save(item);
    }

    public List<SubscriptionItem> getAllItems() {
        return repository.findAll();
    }

    public Optional<SubscriptionItem> getItemById(Long id) {
        return repository.findById(id);
    }

    public SubscriptionItem updateItem(Long id, SubscriptionItem details) {
        SubscriptionItem item = repository.findById(id).orElseThrow();
        item.setItemId(details.getItemId());
        item.setQuantity(details.getQuantity());
        item.setUnitPrice(details.getUnitPrice());
        item.setSubscription(details.getSubscription());
        return repository.save(item);
    }
}
