package com.shivam.repository;

import com.shivam.modal.ActivityLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    @Query("SELECT al FROM ActivityLog al ORDER BY al.createdAt DESC")
    List<ActivityLog> findRecentActivity(Pageable pageable);
}