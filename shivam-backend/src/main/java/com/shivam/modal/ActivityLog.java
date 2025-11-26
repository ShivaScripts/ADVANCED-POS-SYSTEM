package com.shivam.modal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id") // The admin who performed the action
    private User user;

    @ManyToOne
    @JoinColumn(name = "store_id") // The store that was affected
    private Store store;

    @Column(nullable = false)
    private String activityType; // e.g., "STORE_REGISTERED", "STORE_APPROVED"

    @Column(nullable = false)
    private String description; // e.g., "Store 'Zosh Mart' registered"

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}