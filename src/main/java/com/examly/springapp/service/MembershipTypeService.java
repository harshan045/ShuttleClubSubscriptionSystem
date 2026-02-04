package com.examly.springapp.service;

import com.examly.springapp.model.MembershipType;
import com.examly.springapp.repository.MembershipTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MembershipTypeService {
    @Autowired
    private MembershipTypeRepository membershipTypeRepository;

    public List<MembershipType> getAllMembershipTypes() {
        return membershipTypeRepository.findAll();
    }

    public MembershipType createMembershipType(MembershipType membershipType) {
        return membershipTypeRepository.save(membershipType);
    }
}
