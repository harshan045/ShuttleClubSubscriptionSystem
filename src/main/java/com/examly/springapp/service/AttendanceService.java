package com.examly.springapp.service;

import com.examly.springapp.model.Attendance;
import com.examly.springapp.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    public List<Attendance> getAttendanceByUserId(Long userId) {
        return attendanceRepository.findByUserUserId(userId);
    }

    // Helper method to add attendance (used by seeder)
    public Attendance addAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }
}
