// pos-frontend-vite/src/pages/cashier/payment/PaymentDialog.jsx

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectDiscountAmount,
  selectNote,
  selectPaymentMethod,
  selectSelectedCustomer,
  selectSubtotal,
  selectTax,
  selectTotal,
  selectFormattedTotal,
  setPaymentMethod,
  clearCart,
  selectPointsToRedeem,
  setPointsToRedeem,
} from "../../../Redux Toolkit/features/cart/cartSlice";
import {
  selectAcceptsCash,
  selectAcceptsCard,
  selectAcceptsUpi,
  selectStoreCurrency, // <-- Import currency for Razorpay
} from "../../../Redux Toolkit/features/auth/authSlice";
// Replaced useToast hook with Sonner
import { toast } from "sonner";
import { createOrder } from "../../../Redux Toolkit/features/order/orderThunks";
import { paymentMethods } from "./data";
import upiQrCodePlaceholder from '../../../assets/images/QR.jpeg';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";


const PaymentDialog = ({
  showPaymentDialog,
  setShowPaymentDialog,
  setShowReceiptDialog,
  setOrderForReceipt,
}) => {
  // removed: const { toast } = useToast();
  const dispatch = useDispatch();
  const [showUpiConfirmation, setShowUpiConfirmation] = useState(false);

  // Payment Toggle State
  const acceptsCash = useSelector(selectAcceptsCash);
  const acceptsCard = useSelector(selectAcceptsCard);
  const acceptsUpi = useSelector(selectAcceptsUpi);
  const currency = useSelector(selectStoreCurrency); // <-- Get currency

  // Cart State
  const cart = useSelector(selectCartItems);
  const selectedCustomer = useSelector(selectSelectedCustomer);
  const note = useSelector(selectNote);
  const paymentMethod = useSelector(selectPaymentMethod);
  const total = useSelector(selectTotal);
  const formattedTotal = useSelector(selectFormattedTotal);
  const subtotal = useSelector(selectSubtotal);
  const discountAmount = useSelector(selectDiscountAmount);
  const tax = useSelector(selectTax);
  const branch = useSelector((state) => state.branch.branch);
  const { userProfile } = useSelector((state) => state.user);

  // Loyalty Points State
  const pointsToRedeem = useSelector(selectPointsToRedeem);
  const customerPoints = selectedCustomer?.loyaltyPoints || 0;
  const maxRedeemablePoints = Math.floor(Math.min(customerPoints, total + pointsToRedeem));

  useEffect(() => {
    if (!showPaymentDialog) {
      setShowUpiConfirmation(false);
      dispatch(setPointsToRedeem(0)); 
    }
  }, [showPaymentDialog, dispatch]);

  useEffect(() => {
    if (paymentMethod !== 'UPI') setShowUpiConfirmation(false);
  }, [paymentMethod]);

  // --- START: BUG FIX #2 (UPI Flow) ---
  const handlePaymentMethodSelect = (methodKey) => {
    // Check if the selected method is disabled
    if (methodKey === 'CASH' && !acceptsCash) {
      toast.warning("Payment Method Disabled", { description: "Cash payments are currently not accepted." });
      return; 
    }
    if (methodKey === 'CARD' && !acceptsCard) {
      toast.warning("Payment Method Disabled", { description: "Card payments are currently not accepted." });
      return;
    }
    if (methodKey === 'UPI' && !acceptsUpi) {
      toast.warning("Payment Method Disabled", { description: "UPI payments are currently not accepted." });
      return;
    }

    // If not disabled, just set the payment method.
    dispatch(setPaymentMethod(methodKey));
    
    // REMOVED: The logic that was showing the UPI screen immediately
    // if (methodKey === 'UPI') {
    //   setShowUpiConfirmation(true);
    // } else {
    //   setShowUpiConfirmation(false);
    // }
  };
  // --- END: BUG FIX #2 ---

  const processPayment = async () => {
    if (cart.length === 0 || !branch?.id || !userProfile?.id) {
      toast.error("Error", { description: "Missing cart items, branch, or cashier info." });
      return;
    }
    if (!paymentMethod) {
      toast.error("Error", { description: "Please select a payment method." });
      return;
    }
    if (pointsToRedeem > maxRedeemablePoints) {
       toast.error("Invalid Points", { description: `Cannot redeem more than ${maxRedeemablePoints} points.` });
      return;
    }

    if (paymentMethod === 'CARD') {
      console.log("Calling handleRazorpayPayment...");
      handleRazorpayPayment();
    } else if (paymentMethod === 'CASH') {
      console.log("Calling saveOrderInDb for CASH...");
      saveOrderInDb(null);
    // --- START: BUG FIX #2 (UPI Flow) ---
    // Show the confirmation screen *after* clicking "Complete Payment"
    } else if (paymentMethod === 'UPI') {
      console.log("Payment method is UPI, showing confirmation screen...");
      setShowUpiConfirmation(true);
      // We no longer return here
    }
    // --- END: BUG FIX #2 ---
  };

  const saveOrderInDb = async (razorpayPaymentId = null) => {
    const orderData = {
      items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
      customer: selectedCustomer ? { id: selectedCustomer.id } : null,
      paymentType: paymentMethod,
      note: note || "",
      branchId: branch.id,
      subtotal: subtotal,
      discount: discountAmount,
      tax: tax,
      totalAmount: total, 
      razorpayPaymentId: razorpayPaymentId,
    };

    try {
      console.log("Attempting to create order...");
      const createdOrder = await dispatch(createOrder(orderData)).unwrap();
      console.log("Order creation successful:", createdOrder);

      setOrderForReceipt(createdOrder);
      dispatch(clearCart());
      setShowPaymentDialog(false);
      setShowUpiConfirmation(false);
      setShowReceiptDialog(true);

      toast.success("Order Created Successfully", {
        description: `Order #${createdOrder.id} processed.`,
      });

    } catch (error) {
      console.error(">>> ERROR in saveOrderInDb:", error);
      const errorMessage = error?.message || (typeof error === 'string' ? error : "Order creation failed.");
      toast.error("Order Creation Failed", { description: errorMessage });
      setOrderForReceipt(null);
    }
  };

  const handleUpiSuccess = () => {
    saveOrderInDb(null);
  };

  const handleUpiFail = () => {
    setShowUpiConfirmation(false);
    setShowPaymentDialog(false);
    toast.warning("UPI Payment Failed", { description: "Payment marked as failed." });
  };

  // --- START: RESTORED Razorpay Logic ---
  const handleRazorpayPayment = async () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      toast.error("Authentication Error", { description: "Not logged in." });
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/payments/pos/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`,
        },
        body: JSON.stringify({ amount: Math.round(total * 100) / 100 }), 
      });

      const razorpayOrder = await response.json();
      if (!response.ok) throw new Error(razorpayOrder.message || "Failed to create Razorpay order.");
      console.log("Razorpay order created:", razorpayOrder);

      const options = {
        key: "rzp_test_RPPPeinwuh14nT", // Use your TEST key
        amount: razorpayOrder.amount, 
        currency: currency || "INR", // Use currency from state
        name: "Zosh POS", 
        description: `POS Order Payment - Branch ${branch?.name || ''}`,
        order_id: razorpayOrder.orderId, 
        handler: async function (response) {
          console.log("Razorpay payment successful response:", response);
          try {
              const verificationResponse = await fetch("http://localhost:5000/api/payments/pos/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${jwt}` },
                body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                }),
              });
              const verificationResult = await verificationResponse.json();
              console.log("Verification result:", verificationResult);

              if (verificationResponse.ok && verificationResult.status === 'success') {
                console.log("Payment verified successfully.");
                saveOrderInDb(response.razorpay_payment_id);
              } else {
                throw new Error(verificationResult.message || "Payment verification failed.");
              }
          } catch (verifyError) {
               console.error("Payment verification failed:", verifyError);
               toast.error("Payment Verification Failed", { description: verifyError.message });
          }
        },
        prefill: {
          name: selectedCustomer?.fullName || selectedCustomer?.name || '',
          email: selectedCustomer?.email || '',
          contact: selectedCustomer?.phone || '',
        },
        theme: { color: "#3399cc" },
        modal: {
            ondismiss: function(){
                console.log("Razorpay modal dismissed.");
                toast.info("Payment Cancelled", { description: "Card payment window closed."});
            }
        }
      };

      if (window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (response){
              console.error("Razorpay payment failed:", response.error);
              toast.error("Razorpay Payment Failed", {
                  description: `${response.error.description} (Code: ${response.error.code})`,
              });
          });
          rzp.open();
      } else {
          console.error("Razorpay SDK not loaded");
          toast.error("Error", { description: "Payment gateway script not loaded. Please refresh.",});
      }

    } catch (error) {
      console.error("Razorpay payment initiation failed:", error);
      toast.error("Payment Error", { description: error.message || "Card payment failed to start." });
    }
  };
  // --- END: RESTORED Razorpay Logic ---

  // --- START: BUG FIX #1 (Visual) ---
  // Re-implemented the logic to check if a method is disabled
  const isMethodDisabled = (methodKey) => {
    if (methodKey === 'CASH') return !acceptsCash;
    if (methodKey === 'CARD') return !acceptsCard;
    if (methodKey === 'UPI') return !acceptsUpi;
    return false; // Default
  };
  // --- END: BUG FIX #1 ---

  const handlePointsChange = (e) => {
    let points = parseInt(e.target.value) || 0;
    if (points < 0) points = 0;
    if (points > maxRedeemablePoints) {
      points = maxRedeemablePoints;
      toast.warning("Max Points Reached", {
        description: `Cannot redeem more than ${maxRedeemablePoints} points.`,
      });
    }
    dispatch(setPointsToRedeem(points));
  };

  return (
    <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
          <DialogDescription>
            Finalize the transaction by selecting a payment method.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {formattedTotal}
            </div>
            <p className="text-sm text-muted-foreground">Amount to be paid</p>
          </div>
          
          {selectedCustomer && customerPoints > 0 && !showUpiConfirmation && (
            <div className="space-y-3 pt-4 border-t">
              <Label className="flex items-center gap-2 font-medium">
                <Star className="w-4 h-4 text-yellow-500" />
                Redeem Loyalty Points
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  placeholder="Points to redeem"
                  value={pointsToRedeem}
                  onChange={handlePointsChange}
                  max={maxRedeemablePoints}
                  min="0"
                />
                <Button 
                  variant="outline" 
                  onClick={() => dispatch(setPointsToRedeem(maxRedeemablePoints))}
                >
                  Max
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Available: {customerPoints} points (Worth ₹{customerPoints.toFixed(2)})
              </p>
            </div>
          )}

          {!showUpiConfirmation ? (
            <div className="space-y-2 pt-4 border-t">
              {paymentMethods.map((method) => (
                <Button
                  key={method.key}
                  variant={paymentMethod === method.key ? "default" : "outline"}
                  className="w-full justify-start py-3 text-base"
                  onClick={() => handlePaymentMethodSelect(method.key)}
                  // --- START: BUG FIX #1 (Visual) ---
                  // This 'disabled' prop will now work correctly
                  disabled={isMethodDisabled(method.key)}
                  // --- END: BUG FIX #1 ---
                >
                  <div className="flex items-center w-full">
                    <span>{method.label}</span>
                    {isMethodDisabled(method.key) && <span className="ml-auto text-xs text-muted-foreground">(Disabled)</span>}
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-4 pt-4 border-t mt-4">
              <p className="text-center text-sm text-muted-foreground">
                Ask customer to scan the QR code and confirm payment.
              </p>
              <div className="flex justify-center">
                <img src={upiQrCodePlaceholder} alt="UPI QR Code"
                  className="w-48 h-48 md:w-56 md:h-56 border rounded-md" />
              </div>
              <div className="flex justify-center gap-4 pt-4">
                <Button variant="destructive" onClick={handleUpiFail}>Payment Failed</Button>
                <Button variant="success" onClick={handleUpiSuccess}>Payment Successful</Button>
              </div>
              <Button variant="link" size="sm" onClick={() => setShowUpiConfirmation(false)} className="mx-auto block text-muted-foreground">
                Back to payment methods
              </Button>
            </div>
          )}
        </div>

        {!showUpiConfirmation && (
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
            <Button onClick={processPayment} disabled={!paymentMethod || (total > 0 && paymentMethod === 'LOYALTY')}>
              Complete Payment
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
