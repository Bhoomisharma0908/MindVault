package com.bhoomi.mindvault.service.impl;
import com.bhoomi.mindvault.dto.LoginResponseDTO;

import com.bhoomi.mindvault.dto.LoginRequestDTO;
import com.bhoomi.mindvault.dto.UserRequestDTO;
import com.bhoomi.mindvault.dto.UserResponseDTO;

public interface UserService {

    UserResponseDTO registerUser(UserRequestDTO userRequestDTO);
    LoginResponseDTO loginUser(LoginRequestDTO loginRequestDTO);

}
