package com.examly.springapp.controller;

import com.examly.springapp.model.SubscriptionItem;
import com.examly.springapp.service.SubscriptionItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/subscription-items")
public class SubscriptionItemController {
    @Autowired
    private SubscriptionItemService service;

    @PostMapping
    public SubscriptionItem createItem(@RequestBody SubscriptionItem item) {
        return service.createItem(item);
    }

    @GetMapping
    public List<SubscriptionItem> getAllItems() {
        return service.getAllItems();
    }

    @GetMapping("/{id}")
    public SubscriptionItem getItemById(@PathVariable Long id) {
        return service.getItemById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public SubscriptionItem updateItem(@PathVariable Long id, @RequestBody SubscriptionItem details) {
        return service.updateItem(id, details);
    }
}
