package com.nsss.ssdassignment2backend.controller;

import com.nsss.ssdassignment2backend.jwt.JwtUtils;
import com.nsss.ssdassignment2backend.model.ERole;
import com.nsss.ssdassignment2backend.model.Role;
import com.nsss.ssdassignment2backend.model.User;
import com.nsss.ssdassignment2backend.reponse.JwtResponse;
import com.nsss.ssdassignment2backend.reponse.MessageResponse;
import com.nsss.ssdassignment2backend.repository.RoleRepository;
import com.nsss.ssdassignment2backend.repository.UserRepository;
import com.nsss.ssdassignment2backend.request.LoginRequest;
import com.nsss.ssdassignment2backend.request.PasswordChangeRequest;
import com.nsss.ssdassignment2backend.request.SignupRequest;
import com.nsss.ssdassignment2backend.request.UpdateUserDetailsRequest;
import com.nsss.ssdassignment2backend.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest){
        if(userRepository.existsByUsername(signupRequest.getUsername())){
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Username is already taken. Please choose another."));
        }

        if(userRepository.existsByEmail(signupRequest.getEmail())){
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("An account with this email already exists!"));
        }

        User user = new User(
                signupRequest.getUsername(),
                signupRequest.getEmail(),
                encoder.encode(signupRequest.getPassword()),
                signupRequest.getCreatedBy(),
                new Date()
        );

        System.out.println("ROLE REQUEST ------------------------------------------");
        System.out.println(signupRequest.getRoles());

        Set<String> strRoles = signupRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        strRoles.forEach(role -> {
            switch (role){
                case "admin":
                    Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                            .orElseThrow(() -> new RuntimeException("ERROR: Role not found."));
                    System.out.println("ADMIN ROLE ------------------------------------------");
                    System.out.println(adminRole);
                    roles.add(adminRole);
                    break;
                case "manager":
                    Role managerRole = roleRepository.findByName(ERole.ROLE_MANAGER)
                            .orElseThrow(() -> new RuntimeException("ERROR: Role not found."));
                    roles.add(managerRole);
                    break;
                case "worker":
                    Role workerRole = roleRepository.findByName(ERole.ROLE_WORKER)
                            .orElseThrow(() -> new RuntimeException("ERROR: Role not found."));
                    roles.add(workerRole);
                    break;
            }
        });

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully"));
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest){
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles =userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles
        ));
    }

    @PutMapping("/password/change")
    public ResponseEntity<?> changePassword(@Valid @RequestBody PasswordChangeRequest passwordChangeRequest){
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(passwordChangeRequest.getUsername(), passwordChangeRequest.getCurrentPassword()));

        if(authentication.isAuthenticated()){
            User user = userRepository.findByUsername(passwordChangeRequest.getUsername()).get();
            user.setPassword(encoder.encode(passwordChangeRequest.getNewPassword()));
            return new ResponseEntity<>(userRepository.save(user), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUserDetails(@PathVariable("id") String id, @Valid @RequestBody UpdateUserDetailsRequest updateUserDetailsRequest){
        Optional<User> userData = userRepository.findById(id);

        if(userData.isPresent()) {
            User _user = userData.get();
            _user.setFirstName(updateUserDetailsRequest.getFirstName());
            _user.setLastName(updateUserDetailsRequest.getLastName());
            _user.setAddress(updateUserDetailsRequest.getAddress());
            _user.setPhone(updateUserDetailsRequest.getPhone());

            return new ResponseEntity<>(userRepository.save(_user), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
