package com.example.MS_Backend;//package com.example.MS_Backend;
//
//import com.example.MS_Backend.Entity.User;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//@Repository
//public interface UserRepo extends JpaRepository<User, Integer> {
//
//}


import com.example.MS_Backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {
    User findByUserName(String userName);
}


