package com.bhoomi.mindvault.service.impl;

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

    @Override
    public UserResponseDTO registerUser(UserRequestDTO userRequestDTO) {

        // Check if email already exists
        if (userRepository.findByEmail(userRequestDTO.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Email already exists.");
        }

        User user = new User();

        user.setFullName(userRequestDTO.getFullName());
        user.setEmail(userRequestDTO.getEmail());
        user.setPassword(userRequestDTO.getPassword());

        User savedUser = userRepository.save(user);

        return new UserResponseDTO(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail()
        );
    }

    @Override
    public UserResponseDTO loginUser(LoginRequestDTO loginRequestDTO) {

        User user = userRepository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found."));

        if (!user.getPassword().equals(loginRequestDTO.getPassword())) {
            throw new InvalidPasswordException("Invalid password.");
        }

        return new UserResponseDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail()
        );
    }
}