package com.bhoomi.mindvault.service.impl;

import com.bhoomi.mindvault.dto.LoginResponseDTO;
import com.bhoomi.mindvault.jwt.JwtUtil;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.bhoomi.mindvault.dto.LoginRequestDTO;
import com.bhoomi.mindvault.dto.UserRequestDTO;
import com.bhoomi.mindvault.dto.UserResponseDTO;
import com.bhoomi.mindvault.entity.User;
import com.bhoomi.mindvault.exception.InvalidPasswordException;
import com.bhoomi.mindvault.exception.UserAlreadyExistsException;
import com.bhoomi.mindvault.exception.UserNotFoundException;
import com.bhoomi.mindvault.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public UserResponseDTO registerUser(UserRequestDTO userRequestDTO) {

        // Check if email already exists
        if (userRepository.findByEmail(userRequestDTO.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Email already exists.");
        }

        User user = new User();

        user.setFullName(userRequestDTO.getFullName());
        user.setEmail(userRequestDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));

        User savedUser = userRepository.save(user);

        return new UserResponseDTO(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail()
        );
    }

    @Override
    public LoginResponseDTO loginUser(LoginRequestDTO loginRequestDTO) {

        User user = userRepository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found."));

        if (!passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword())) {
            throw new InvalidPasswordException("Invalid password.");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new LoginResponseDTO(token);
    }

}