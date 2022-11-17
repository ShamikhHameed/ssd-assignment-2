package com.nsss.ssdassignment2backend.repository;

import com.nsss.ssdassignment2backend.model.ERole;
import com.nsss.ssdassignment2backend.model.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RoleRepository extends MongoRepository<Role, String> {
    Optional<Role> findByName(ERole name);
}
