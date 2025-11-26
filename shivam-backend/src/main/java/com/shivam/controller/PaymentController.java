package com.shivam.controller;

import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;
import com.shivam.domain.PaymentMethod;
import com.shivam.exception.UserException;
import com.shivam.modal.PaymentOrder;
import com.shivam.modal.User;
import com.shivam.payload.request.CreatePaymentRequest;
import com.shivam.payload.response.PaymentLinkResponse;
import com.shivam.service.PaymentService;
import com.shivam.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final UserService userService;

    // This is your existing subscription endpoint - no changes
    @PostMapping("/create")
    public ResponseEntity<PaymentLinkResponse> createPaymentLink(
            @RequestHeader("Authorization") String jwt,
            @RequestParam Long planId,
            @RequestParam PaymentMethod paymentMethod) throws UserException, RazorpayException, StripeException {
        User user = userService.getUserFromJwtToken(jwt);
        PaymentLinkResponse paymentLinkResponse =
                paymentService.createOrder(user, planId, paymentMethod);
        return ResponseEntity.ok(paymentLinkResponse);
    }

    // This is your existing subscription endpoint - no changes
    @PatchMapping("/proceed")
    public ResponseEntity<Boolean> proceedPayment(
            @RequestParam String paymentId,
            @RequestParam String paymentLinkId) throws Exception {
        PaymentOrder paymentOrder = paymentService.
                getPaymentOrderByPaymentId(paymentLinkId);
        Boolean success = paymentService.ProceedPaymentOrder(
                paymentOrder,
                paymentId, paymentLinkId);
        return ResponseEntity.ok(success);
    }

    // --- NEW ENDPOINTS FOR POS ---

    @PostMapping("/pos/create")
    public ResponseEntity<Map<String, String>> createPosOrder(@RequestBody CreatePaymentRequest request) throws RazorpayException {
        Map<String, String> response = paymentService.createPosOrder(request.getAmount());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/pos/verify")
    public ResponseEntity<Map<String, String>> verifyPosPayment(@RequestBody Map<String, String> payload) {
        boolean isValid = paymentService.verifyPaymentSignature(payload);
        if (isValid) {
            return ResponseEntity.ok(Map.of("status", "success", "message", "Payment verified successfully."));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("status", "error", "message", "Invalid payment signature."));
        }
    }
}