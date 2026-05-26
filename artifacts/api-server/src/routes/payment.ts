import { Router, type IRouter } from "express";
import Razorpay from "razorpay";
import { createHmac } from "crypto";

const router: IRouter = Router();

/* ════════════════════════════════════════════════════════════
   POST /payment/create-order
   Creates a Razorpay order. Frontend uses the returned
   orderId to open the Razorpay checkout UI.
   ════════════════════════════════════════════════════════════ */
router.post("/payment/create-order", async (req, res) => {
  const { noteId, amount } = req.body as { noteId?: number; amount?: string };

  if (!noteId || !amount) {
    res.status(400).json({ success: false, error: "noteId and amount are required." });
    return;
  }

  const amountNum = parseInt(String(amount).replace(/[^0-9]/g, ""));
  if (!amountNum || amountNum <= 0) {
    res.status(400).json({ success: false, error: "Invalid amount." });
    return;
  }

  const keyId     = process.env["RAZORPAY_KEY_ID"];
  const keySecret = process.env["RAZORPAY_KEY_SECRET"];
  if (!keyId || !keySecret) {
    res.status(503).json({ success: false, error: "Payment gateway not configured." });
    return;
  }

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount: amountNum * 100, // Razorpay expects paise
      currency: "INR",
      receipt: `ss_${noteId}_${Date.now()}`,
    });

    req.log.info({ noteId, amountNum, orderId: order.id }, "Razorpay order created");
    res.json({ success: true, orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    req.log.error({ err }, "Razorpay create-order failed");
    res.status(500).json({ success: false, error: "Could not initiate payment. Please try again." });
  }
});

/* ════════════════════════════════════════════════════════════
   POST /payment/verify
   Verifies the Razorpay payment signature to confirm the
   payment is genuine before granting content access.
   ════════════════════════════════════════════════════════════ */
router.post("/payment/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body as {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400).json({ success: false, error: "Missing payment verification fields." });
    return;
  }

  const keySecret = process.env["RAZORPAY_KEY_SECRET"];
  if (!keySecret) {
    res.status(503).json({ success: false, error: "Payment gateway not configured." });
    return;
  }

  const expected = createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected !== razorpay_signature) {
    req.log.error({ razorpay_order_id }, "Razorpay signature mismatch — possible tamper");
    res.status(400).json({ success: false, error: "Payment verification failed. Please contact support." });
    return;
  }

  req.log.info({ razorpay_payment_id }, "Payment verified successfully");
  res.json({ success: true, paymentId: razorpay_payment_id });
});

export default router;
