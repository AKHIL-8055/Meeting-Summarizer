package com.example.MS_Backend;


import com.example.MS_Backend.Entity.Summaries;
import com.example.MS_Backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface summariesRepo extends JpaRepository<Summaries,Integer> {

    List<Summaries> findByUser(User user);
}
