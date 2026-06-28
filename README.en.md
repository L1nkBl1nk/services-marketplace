# Services Marketplace

Full-stack electronics online store. Device catalog with filtering by types and brands, user registration and authentication via JWT, shopping cart, **Stripe checkout**, order history, and an admin panel for managing products.

🔗 **[Live demo →](https://services-marketplace-three.vercel.app)**

> Hosted on free tiers — the API may take ~30–50s to wake up on the first request.
> To test payment, use Stripe test card `4242 4242 4242 4242`, any future expiry, any CVC/ZIP.

## Tech Stack

**Frontend (`client/`)**
- React 19 + Vite 7
- MobX — state management
- React Router 7 — routing
- React-Bootstrap / Bootstrap 5 — UI
- Axios — HTTP client
- jwt-decode — JWT parsing on the client

**Backend (`server/`)**
- Node.js + Express 5
- Sequelize 6 (ORM) + PostgreSQL
- JWT (jsonwebtoken) — authentication
- bcrypt — password hashing
- express-fileupload — product image uploads
- cors, dotenv

## Project Structure

```
services-marketplace/
├── client/                 # React app (Vite)
│   └── src/
│       ├── components/     # Navbar, BrandBar, TypeBar, DeviceList, modals, etc.
│       ├── pages/          # Shop, Auth, Basket, DevicePage, Admin
│       ├── store/          # MobX stores: User, Device, Basket
│       ├── http/           # axios instances and API wrappers
│       └── utils/          # constants, routes
└── server/                 # Express REST API
    ├── controllers/        # business logic
    ├── routes/             # endpoint definitions
    ├── models/             # Sequelize models and associations
    ├── middleware/         # auth, role check, error handling
    ├── static/             # uploaded images
    └── db.js               # PostgreSQL connection
```

## Data Model

- **User** — `email`, `password`, `role` (`USER` / `ADMIN`)
- **Basket** — cart (one per user), holds **BasketDevice** items
- **Device** — product: `name`, `price`, `rating`, `img`; belongs to **Type** and **Brand**
- **Type** / **Brand** — categories and brands (many-to-many via **TypeBrand**)
- **Rating** — device ratings left by users
- **DeviceInfo** — device specs (`title`, `description`)
- **BasketDevice** — cart line with a `quantity`
- **Order** — `status` (`pending` / `paid`), `total`, `stripeSessionId`; belongs to **User**, has many **OrderItem**
- **OrderItem** — snapshot of a purchased product: `name`, `price`, `quantity`, `img`

## Requirements

- Node.js 18+
- PostgreSQL 12+

## Setup & Run

### 1. Clone

```bash
git clone https://github.com/L1nkBl1nk/services-marketplace.git
cd services-marketplace
```

### 2. Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:

```env
PORT=5000
DB_NAME=marketplace
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=your_secret_key

# Stripe — use TEST keys from https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_xxx
# Where the React client runs (for Stripe success/cancel redirects)
CLIENT_URL=http://localhost:5173
# Optional: public URL of this server, enables product images in Stripe Checkout
# SERVER_URL=http://localhost:5000
```

> A `server/.env.example` is included as a template.

Create the database in PostgreSQL (the name must match `DB_NAME`):

```sql
CREATE DATABASE marketplace;
```

Run (tables are created automatically via `sequelize.sync()`):

```bash
npm run dev
```

The server starts at `http://localhost:5000`.

### 3. Frontend

```bash
cd ../client
npm install
```

Create a `.env` file in the `client/` folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

The client will be available at the URL printed by Vite (`http://localhost:5173` by default).

## API

Base prefix — `/api`.

### Users — `/api/user`
| Method | Path | Description | Access |
|--------|------|-------------|--------|
| POST | `/registration` | Register, returns JWT | Public |
| POST | `/login` | Log in, returns JWT | Public |
| GET | `/auth` | Verify/refresh token | Authenticated |
| DELETE | `/:id` | Delete a user | ADMIN |

### Devices — `/api/device`
| Method | Path | Description | Access |
|--------|------|-------------|--------|
| POST | `/` | Create a device (with `img` upload) | — |
| GET | `/` | List devices (type/brand filters, pagination) | Public |
| GET | `/:id` | Single device | Public |
| DELETE | `/:id` | Delete a device | ADMIN |

### Types — `/api/type`
| Method | Path | Description | Access |
|--------|------|-------------|--------|
| POST | `/` | Create a type | ADMIN |
| GET | `/` | List types | Public |
| DELETE | `/:id` | Delete a type | — |

### Brands — `/api/brand`
| Method | Path | Description | Access |
|--------|------|-------------|--------|
| POST | `/` | Create a brand | — |
| GET | `/` | List brands | Public |
| DELETE | `/:id` | Delete a brand | — |

### Basket — `/api/basket`
| Method | Path | Description | Access |
|--------|------|-------------|--------|
| GET | `/` | Get the cart (with quantities) | Authenticated |
| POST | `/` | Add a device (increments quantity if already in cart) | Authenticated |
| PUT | `/:id` | Update a line quantity (0 removes it) | Authenticated |
| DELETE | `/:id` | Remove a device from the cart | Authenticated |

### Orders & Checkout — `/api/order`
| Method | Path | Description | Access |
|--------|------|-------------|--------|
| POST | `/checkout` | Create an order from the cart and start a Stripe Checkout session; returns `{ url }` | Authenticated |
| GET | `/confirm?session_id=...` | Verify payment on return from Stripe, mark order paid, empty the cart | Authenticated |
| GET | `/` | List the current user's orders with items | Authenticated |

**Payment flow:** the client calls `POST /api/order/checkout`, receives a Stripe Checkout `url`, and redirects the browser there. After paying, Stripe redirects back to `/checkout/success?session_id=...`, where the client calls `GET /api/order/confirm` to finalise the order.

In Stripe **test mode**, use card `4242 4242 4242 4242`, any future expiry, any CVC and ZIP.

Protected endpoints require the header:

```
Authorization: Bearer <token>
```

## Scripts

**server/**
- `npm run dev` — run with auto-reload (nodemon)

**client/**
- `npm run dev` — Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the build
- `npm run lint` — ESLint check
