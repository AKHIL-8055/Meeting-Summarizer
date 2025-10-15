package com.example.MS_Backend;//package com.example.MS_Backend;
//
//import com.example.MS_Backend.Entity.User;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@RestController
//public class AuthController {
//
//    @Autowired
//    UserRepo userRepo;
//
//    // ---------- SIGN UP ----------
//    @PostMapping("/signUp")
//    public String signUp(@RequestBody User u) {
//        User existingUser = userRepo.findById(u.getUserId()).orElse(null);
//        if (existingUser != null) {
//            return "User already exists!";
//        }
//        userRepo.save(u);
//        return "User registered successfully!";
//    }
//
//    // ---------- SIGN IN ----------
//    @PostMapping("/signIn")
//    public String signIn(@RequestBody User u) {
//        User existingUser = userRepo.findById(u.getUserId()).orElse(null);
//        if (existingUser == null) {
//            return "User not found!";
//        }
//
//        if (!existingUser.getPassword().equals(u.getPassword())) {
//            return "Invalid password!";
//        }
//
//
//        //Here return token
//        String token = JWT.generateToken(existingUser.getUserId());
//        System.out.println("in service"+token);
//        Map<String, String> response = new HashMap<>();
//        response.put("token", token);
//
//
//        return token;
//
//    }
//}


import com.example.MS_Backend.Entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.HashMap;
import java.util.Map;

import static org.springframework.security.config.Elements.JWT;

@RestController
public class AuthController {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private JWT j;

    // ---------- SIGN UP ----------
    @PostMapping("/signUp")
    public String signUp(@RequestBody Map<String, String> request) {
        String userName = request.get("userName");
        String password = request.get("password");

        User existingUser = userRepo.findByUserName(userName);
        if (existingUser != null) {
            return "User already exists!";
        }

        User newUser = new User(userName, password);
        userRepo.save(newUser);

        return "User registered successfully!";
    }

    // ---------- SIGN IN ----------
    @PostMapping("/signIn")
    public Object signIn(@RequestBody Map<String, String> request) {
        String userName = request.get("userName");
        String password = request.get("password");

        User existingUser = userRepo.findByUserName(userName);
        if (existingUser == null) {
            return "User not found!";
        }

        if (!existingUser.getPassword().equals(password)) {
            return "Invalid password!";
        }

        // Generate token
        String token = com.example.MS_Backend.JWT.generateToken(existingUser.getUserId());
        System.out.println("Generated token: " + token);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("message", "Login successful");

        return response;
    }
}
