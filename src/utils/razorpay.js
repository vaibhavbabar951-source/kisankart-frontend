import api from "../api/axios";

const loadScript = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => reject(new Error("Could not load Razorpay. Check your internet."));
    document.body.appendChild(s);
  });

// Resolves true when paid + verified, false if the user closed the popup
export async function payForOrder(orderId, user) {
  await loadScript();
  const { data } = await api.post("/payments/create", { orderId });

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: "KisanKart",
      description: "Order payment",
      order_id: data.razorpayOrderId,
      prefill: { name: user?.name, email: user?.email, contact: user?.phone },
      theme: { color: "#ff6b00" },
      handler: async (resp) => {
        try {
          await api.post("/payments/verify", resp);
          resolve(true);
        } catch (e) {
          reject(e);
        }
      },
      modal: { ondismiss: () => resolve(false) },
    });
    rzp.open();
  });
}
