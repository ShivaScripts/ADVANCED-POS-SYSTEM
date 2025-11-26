package com.shivam.service;



import com.razorpay.PaymentLink;
import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;
import com.shivam.domain.PaymentMethod;
import com.shivam.exception.UserException;
import com.shivam.modal.PaymentOrder;
import com.shivam.modal.User;
import com.shivam.payload.response.PaymentLinkResponse;

import java.util.Map;


public interface PaymentService {

    PaymentLinkResponse createOrder(User user,
                                    Long planId,
                                    PaymentMethod paymentMethod
    ) throws RazorpayException, UserException, StripeException;

    PaymentOrder getPaymentOrderById(Long id) throws Exception;

    PaymentOrder getPaymentOrderByPaymentId(String paymentId) throws Exception;

    Boolean ProceedPaymentOrder (PaymentOrder paymentOrder,
                                 String paymentId,
                                 String paymentLinkId) throws RazorpayException;

    PaymentLink createRazorpayPaymentLink(User user,
                                          Double Amount,
                                          Long orderId) throws RazorpayException;

    String createStripePaymentLink(User user,
                                   Double Amount,
                                   Long planId) throws StripeException;
    // Add these two new method signatures to your existing PaymentService interface
    Map<String, String> createPosOrder(Double amount) throws RazorpayException;
    boolean verifyPaymentSignature(Map<String, String> payload);
}
