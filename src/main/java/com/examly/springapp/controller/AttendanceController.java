package com.examly.springapp.controller;

import com.examly.springapp.model.Attendance;
import com.examly.springapp.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Attendance>> getAttendanceByUserId(@PathVariable Long userId) {
        List<Attendance> attendanceList = attendanceService.getAttendanceByUserId(userId);
        return ResponseEntity.ok(attendanceList);
    }
}
