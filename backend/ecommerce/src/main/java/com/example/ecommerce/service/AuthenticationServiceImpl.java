package com.example.ecommerce.service;

import com.example.ecommerce.dtos.AuthenticationRequestDto;
import com.example.ecommerce.dtos.AuthenticationResponseDto;
import com.example.ecommerce.dtos.RegisterRequestDto;
import com.example.ecommerce.model.Token;
import com.example.ecommerce.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final JwtService jwtService;
    private  final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final TokenService tokenService;


    // AuthenticationServiceImpl.java

    @Override
    public AuthenticationResponseDto register(RegisterRequestDto request) {
        // 1. Create and Save the user (it should be disabled by default in your UserService)
        RegisterRequestDto userDto = RegisterRequestDto.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        User saved = userService.saveUser(userDto);

        // 2. Generate and Save the 4-digit verification token
        String verificationToken = String.valueOf(new java.security.SecureRandom().nextInt(9000) + 1000);
        Token token = Token.builder()
                .token(verificationToken)
                .userId(saved.getId())
                .createdAt(LocalDateTime.now())
                .build();
        tokenService.saveToken(token);

        // 3. Send the email (Wrap in try-catch to ensure JWT is still returned if mail fails)
        try {
            emailService.sendVerificationEmail(saved.getEmail(), verificationToken);
        } catch (Exception e) {
            // Log the error, but don't stop the flow; user can "Resend" on the verify page
            System.err.println("Failed to send email: " + e.getMessage());
        }

        // 4. Generate JWT immediately so they are "Authorized"
        String jwtToken = jwtService.generateToken(saved);

        return AuthenticationResponseDto.builder()
                .token(jwtToken)
                .name(saved.getName())
                .email(saved.getEmail())
                .role(saved.getRole())
                .build();
    }


    @Override
    public ResponseEntity<String> verifyUser(String email, String token) {
        try{
            User user = userService.findByEmail(email.toLowerCase().trim());

            if (user.isEnabled()) {
                throw new RuntimeException("Account is already verified");
            }

            Token storedToken = tokenService.findByTokenAndUserId(token, user.getId());

            if (storedToken.getCreatedAt().isBefore(LocalDateTime.now().minusHours(1))) {
                return ResponseEntity.badRequest().body("Token has expired. please try again with new token");
            }

            user.setEnabled(true);
            userService.updateUser(user);

            tokenService.deleteToken(storedToken.getId());

            return ResponseEntity.ok("Account verified successfully! You can now log in.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @Override
    public ResponseEntity<String> resendVerificationToken(String email) {
        User user = userService.findByEmail(email.toLowerCase().trim());

        if (user.isEnabled()) {
            return ResponseEntity.badRequest().body("Account is already verified.");
        }

        tokenService.deleteByUserId(user.getId());

        String newToken = String.valueOf(new java.security.SecureRandom().nextInt(9000) + 1000);
        Token token = Token.builder()
                .token(newToken)
                .userId(user.getId())
                .createdAt(LocalDateTime.now())
                .build();

        tokenService.saveToken(token);

        try {
            emailService.sendVerificationEmail(user.getEmail(), newToken);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error sending email. Please try again.");
        }

        return ResponseEntity.ok("A new 4-digit verification code has been sent to your email.");
    }

    @Override
    public AuthenticationResponseDto authenticate(AuthenticationRequestDto request) {
        User user = userService.findByEmail(request.getEmail());
        if (!user.isEnabled()) {
            throw new RuntimeException("Please verify your account before logging in.");
        }
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword())
        );

        String jwtToken = jwtService.generateToken(user);
      return AuthenticationResponseDto.builder()
            .token(jwtToken)
            .name(user.getName())
            .email(user.getEmail())
            .role(user.getRole()) // 👈 Pass the Role enum here
            .build();
    }
}
