package com.bhoomi.mindvault.controller;
import jakarta.validation.Valid;

import com.bhoomi.mindvault.dto.LoginRequestDTO;
import com.bhoomi.mindvault.dto.UserRequestDTO;
import com.bhoomi.mindvault.dto.UserResponseDTO;
import com.bhoomi.mindvault.service.impl.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public UserResponseDTO registerUser(@Valid @RequestBody UserRequestDTO userRequestDTO) {
        return userService.registerUser(userRequestDTO);
    }
    @PostMapping("/login")
    public UserResponseDTO loginUser(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        return userService.loginUser(loginRequestDTO);
    }
}
