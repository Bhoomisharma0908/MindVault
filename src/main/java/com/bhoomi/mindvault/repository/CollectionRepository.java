package com.bhoomi.mindvault.repository;

import com.bhoomi.mindvault.entity.Collection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CollectionRepository
        extends JpaRepository<Collection, Long> {

    List<Collection> findByUserEmail(String email);

    boolean existsByNameAndUserEmail(
            String name,
            String email);

    List<Collection> findByUserEmailAndNameContainingIgnoreCase(
            String email,
            String name);
}
