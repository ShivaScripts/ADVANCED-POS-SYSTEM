package com.shivam.service;

import com.shivam.payload.AdminAnalysis.DashboardSummaryDTO;
import com.shivam.payload.AdminAnalysis.StoreRegistrationStatDTO;
import com.shivam.payload.AdminAnalysis.StoreStatusDistributionDTO;
import com.shivam.payload.dto.ActivityLogDTO; // <-- START: ADD THIS

import java.util.List;

public interface AdminDashboardService {

    DashboardSummaryDTO getDashboardSummary();

    List<StoreRegistrationStatDTO> getLast7DayRegistrationStats();

    StoreStatusDistributionDTO getStoreStatusDistribution();

    // --- START: ADD THIS ---
    List<ActivityLogDTO> getRecentActivity();
    // --- END: ADD THIS ---
}