# KisanKart Frontend (React + Vite + Tailwind v4)

Dark theme with orange accent. Change colors in `src/index.css` (the `@theme` block).

## Setup
1. Packages needed (already installed in your project): `axios react-router-dom tailwindcss @tailwindcss/vite`
2. In `vite.config.js` add Tailwind:
   ```js
   import tailwindcss from "@tailwindcss/vite";
   export default defineConfig({ plugins: [react(), tailwindcss()] });
   ```
3. Copy `.env.example` to `.env` (backend URL, default http://localhost:5000)
4. `npm run dev`  ->  http://localhost:5173

Backend must be running and `CLIENT_URL` in the backend `.env` should be `http://localhost:5173`.

## Pages
- Public: Home (search, category filter, pagination), Product detail, Login, Signup (with photo), Cart
- Buyer: Checkout (COD / Razorpay), My Orders (pay, cancel)
- Farmer: My Products, Add/Edit product (image upload), Orders Received (confirm, ship, deliver)
- Admin: Overview stats, Users (block/delete), Orders, Payments
- Everyone: Profile (photo upload, details, password)
