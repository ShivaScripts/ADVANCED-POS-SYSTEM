package com.shivam.payload.dto;

import com.shivam.modal.ActivityLog;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLogDTO {
    private Long id;
    private String storeName;
    private String activityType;
    private String description;
    private LocalDateTime createdAt;

    public static ActivityLogDTO fromEntity(ActivityLog log) {
        return ActivityLogDTO.builder()
                .id(log.getId())
                .storeName(log.getStore() != null ? log.getStore().getBrand() : "N/A")
                .activityType(log.getActivityType())
                .description(log.getDescription())
                .createdAt(log.getCreatedAt())
                .build();
    }
}