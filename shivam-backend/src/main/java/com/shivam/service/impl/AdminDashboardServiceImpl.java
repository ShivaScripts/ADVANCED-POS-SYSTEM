// AdminDashboardServiceImpl.java
package com.shivam.service.impl;

import com.shivam.domain.StoreStatus;
import com.shivam.payload.AdminAnalysis.DashboardSummaryDTO;
import com.shivam.payload.AdminAnalysis.StoreRegistrationStatDTO;
import com.shivam.payload.AdminAnalysis.StoreStatusDistributionDTO;
import com.shivam.repository.StoreRepository;
import com.shivam.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
// ... other imports
import com.shivam.payload.dto.ActivityLogDTO; // <-- START: ADD
import com.shivam.repository.ActivityLogRepository; // <-- START: ADD
import org.springframework.data.domain.PageRequest; // <-- START: ADD
import org.springframework.data.domain.Pageable; // <-- START: ADD
import java.util.stream.Collectors; // <-- START: ADD
// ...
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final StoreRepository storeRepository;
    private final ActivityLogRepository activityLogRepository;
    @Override
    public DashboardSummaryDTO getDashboardSummary() {
        Long total = storeRepository.count();
        Long active = storeRepository.countByStatus(StoreStatus.ACTIVE);
        Long pending = storeRepository.countByStatus(StoreStatus.PENDING);
        Long blocked = storeRepository.countByStatus(StoreStatus.BLOCKED);

        return DashboardSummaryDTO.builder()
                .totalStores(total)
                .activeStores(active)
                .pendingStores(pending)
                .blockedStores(blocked)
                .build();
    }
    @Override
    public List<ActivityLogDTO> getRecentActivity() {
        // Fetch top 3 recent logs
        Pageable limit = PageRequest.of(0, 3);
        return activityLogRepository.findRecentActivity(limit)
                .stream()
                .map(ActivityLogDTO::fromEntity)
                .collect(Collectors.toList());
    }
    @Override
    public List<StoreRegistrationStatDTO> getLast7DayRegistrationStats() {
        LocalDateTime today = LocalDateTime.now();
        LocalDateTime sevenDaysAgo = today.minusDays(6);
        List<Object[]> rawStats = storeRepository.getStoreRegistrationStats(sevenDaysAgo);

        Map<String, Long> dataMap = new LinkedHashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // Initialize 0 counts for 7 days
        for (int i = 0; i < 7; i++) {
            LocalDateTime date = sevenDaysAgo.plusDays(i);
            dataMap.put(date.format(formatter), 0L);
        }

        for (Object[] row : rawStats) {
            LocalDateTime date = (LocalDateTime) row[0];
            Long count = (Long) row[1];
            dataMap.put(date.format(formatter), count);
        }

        List<StoreRegistrationStatDTO> result = new ArrayList<>();
        dataMap.forEach((date, count) -> result.add(
                StoreRegistrationStatDTO.builder().date(date).count(count).build()
        ));

        return result;
    }

    @Override
    public StoreStatusDistributionDTO getStoreStatusDistribution() {
        Long active = storeRepository.countByStatus(StoreStatus.ACTIVE);
        Long blocked = storeRepository.countByStatus(StoreStatus.BLOCKED);
        Long pending = storeRepository.countByStatus(StoreStatus.PENDING);

        return StoreStatusDistributionDTO.builder()
                .active(active)
                .blocked(blocked)
                .pending(pending)
                .build();
    }
}
