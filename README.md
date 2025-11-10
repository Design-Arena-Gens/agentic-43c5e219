# Elite Electronics

Elite Electronics is a modern, full-stack ecommerce experience for high-end gadgets. The project pairs a responsive React (Next.js) storefront with an Express + MongoDB API, includes secure authentication, Stripe-powered checkout, and an admin console for catalog management. The solution is designed for deployment on Vercel.

## ✨ Highlights

- **Responsive storefront** with dark/light mode, featured promos, product search, and rich filtering.
- **Secure accounts** featuring sign-up, login, JWT auth via HttpOnly cookies, and personal order history.
- **Shopping journey** covering cart management, Stripe Payment Elements checkout, and order confirmation.
- **Admin dashboard** to create, edit, and remove products with live catalog updates.
- **Express API** delivered through a Next.js API route, backed by MongoDB + Mongoose models and seeded sample data.

## 🧱 Tech Stack

- **Frontend:** Next.js 14 (React 18), Tailwind CSS, SWR, Heroicons, Stripe Elements
- **Backend:** Express (via serverless handler), MongoDB, Mongoose, JSON Web Tokens, bcrypt
- **Payments:** Stripe Payment Intents API
- **Tooling:** ESLint, PostCSS, Tailwind, npm scripts

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env.local` file (based on `.env.local.example`) with your credentials:

```
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-32-char-secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

> MongoDB Atlas or any reachable MongoDB instance will work. Stripe test keys are sufficient during development.

### 3. Run the app locally

```bash
npm run dev
```

The storefront is available at `http://localhost:3000`. API routes are served under `/api/*`.

### 4. Production build & start

```bash
MONGODB_URI=... JWT_SECRET=... STRIPE_SECRET_KEY=... STRIPE_PUBLISHABLE_KEY=... npm run build
npm start
```

## 🧭 Project Structure

```
.
├── components/           # Reusable UI building blocks
├── contexts/             # App-wide state (auth, cart, theme)
├── lib/                  # Database + auth utilities
├── models/               # Mongoose models (User, Product, Order)
├── pages/                # Next.js pages & API (Express wrapped handler)
├── public/               # Static assets
├── styles/               # Tailwind entrypoint / global styles
├── utils/                # Client-side helpers
├── package.json
└── README.md
```

## 🔐 Authentication & Authorization

- Users register and log in via `/api/auth/*` routes; passwords are hashed with bcrypt.
- Auth tokens are signed JWTs stored in HttpOnly cookies to protect against XSS.
- Protected routes use middleware guards (`requireUser` / `requireAdmin`).

## 💳 Checkout Flow

1. Cart contents are priced with live MongoDB data to avoid tampering.
2. A Payment Intent is created via `/api/checkout/create-intent`.
3. Stripe Payment Elements collect card details on the client.
4. After confirmation, an order is persisted (`/api/orders`) and cart is cleared.

## 🛠️ Admin Dashboard

- View the full catalog and seeded sample products.
- Create new products with name, pricing, inventory, and tags.
- Edit or remove existing entries in real time.
- Only accessible to users with the `admin` role.

## ✅ Quality Checks

- `npm run lint` — ESLint (Next.js config)
- `npm run build` — production bundle; ensures API/pages compile cleanly

## 🌐 Deployment

The project is optimized for Vercel:

1. Ensure required env vars are set in the Vercel project.
2. Deploy with `vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-43c5e219`.
3. Stripe webhooks are not required for basic card payments, but consider adding if you expand fulfillment logic.

## 📄 License

This project is provided under the MIT license. Customize and extend freely.

---

Crafted with care by the Elite Electronics engineering team.
