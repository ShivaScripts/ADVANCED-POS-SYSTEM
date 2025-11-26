package com.shivam.controller;

import com.shivam.exception.UserException;
import com.shivam.modal.User;
import com.shivam.payload.dto.DashboardAnalyticsDTO;
import com.shivam.service.OrderService;
import com.shivam.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final OrderService orderService;
    private final UserService userService;

    /**
     * Gets the current day's analytics (sales, orders) for the logged-in manager's branch.
     * This is used to "hydrate" the dashboard on load.
     */
    @GetMapping("/current")
    public ResponseEntity<DashboardAnalyticsDTO> getCurrentAnalytics() throws UserException {
        // 1. Get the current user (manager)
        User currentUser = userService.getCurrentUser();
        if (currentUser.getBranch() == null) {
            throw new UserException("User is not associated with a branch.");
        }

        // 2. Get their branch ID
        Long branchId = currentUser.getBranch().getId();

        // 3. Call the service to get analytics
        DashboardAnalyticsDTO analytics = orderService.getDashboardAnalytics(branchId);

        return ResponseEntity.ok(analytics);
    }
}