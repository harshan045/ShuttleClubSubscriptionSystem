package com.examly.springapp.controller;

import com.examly.springapp.model.MembershipType;
import com.examly.springapp.service.MembershipTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/plans")
public class MembershipTypeController {
    @Autowired
    private MembershipTypeService membershipTypeService;

    @GetMapping
    public List<MembershipType> getAllPlans() {
        return membershipTypeService.getAllMembershipTypes();
    }

    @PostMapping
    public MembershipType createPlan(@RequestBody MembershipType plan) {
        return membershipTypeService.createMembershipType(plan);
    }
}
