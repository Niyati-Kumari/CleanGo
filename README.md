# CleanGo

Multi-vendor marketplace for laundry and dry cleaning — Swiggy/Zomato for dry cleaners.

## Stack

- **Client:** React, Vite, Tailwind CSS
- **Server:** Node.js, Express, MongoDB
- **Auth:** JWT

## Features

### Customer App
- Browse service categories (Clothes, Shoes, Bags, Sofa, Curtains)
- Compare nearby cleaners with prices and ratings
- Schedule pickup slot
- Place order (COD / online payment stub)
- Track order status in real-time
- Order history

### Cleaner Partner Portal
- Partner registration with shop + bank details
- Admin approval workflow (pending → approved)
- Partner dashboard — new/active/completed orders, earnings
- Accept or reject incoming orders
- Update order status through cleaning pipeline
- Price management per service item
- Earnings analytics

### Delivery Partner Portal
- Registration with vehicle and document verification
- Admin approval workflow
- Toggle online/offline status
- View available delivery requests
- Accept and manage deliveries
- OTP-based delivery confirmation
- Earnings tracking

### Admin Panel
- Platform dashboard with key metrics
- User management (customers, partners, delivery)
- Cleaner approval/rejection
- Delivery partner approval/rejection
- Order monitoring and management
- Revenue analytics

## Demo Accounts (after `npm run seed`)

| Role | Phone | Password | Details |
|------|-------|----------|---------|
| Customer | 9999999999 | demo123 | Demo customer account |
| Cleaner Partner | 8888888888 | demo123 | Royal Cleaners (approved) |
| Delivery Partner | 7777777777 | demo123 | Vikram Singh (approved, online) |
| Admin | 0000000000 | admin123 | Platform administrator |

## Quick start

### Prerequisites

- Node.js 18+
- MongoDB — either:
  - **Docker:** `docker compose up -d` (included)
  - **Local:** `mongod` running on port 27017
  - **Atlas:** set `MONGODB_URI` in `server/.env`

### Server

```bash
cd server
cp .env.example .env
npm install
npm run seed    # seed sample cleaners
npm run dev
```

Server runs at `http://localhost:5000`.

### Client

```bash
cd client
npm install
npm run dev
```

Client runs at `http://localhost:5173`.

## Project structure

```
CleanGo/
├── client/                 # Customer web app
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # Shared components (Layout, StarRating, etc.)
│   │   ├── context/       # React Context (Auth, Booking)
│   │   ├── pages/         # Page components
│   │   │   ├── admin/     # Admin panel pages
│   │   │   ├── delivery/  # Delivery partner pages
│   │   │   ├── partner/   # Cleaner partner pages
│   │   │   └── ...        # Customer pages
│   │   └── ...
├── server/                 # REST API
│   ├── src/
│   │   ├── config/        # Database config
│   │   ├── controllers/   # Route handlers
│   │   ├── data/          # Static data (catalog)
│   │   ├── middleware/    # Auth, role checks
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # Express routes
│   │   ├── seed/          # Database seeding
│   │   └── ...
├── docker-compose.yml      # MongoDB container
└── README.md
```

## API Routes

### Auth (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user

### Cleaners (`/api/cleaners`)
- `GET /catalog` - Get service catalog
- `GET /` - List cleaners (with optional filters)
- `GET /:id` - Get cleaner details

### Orders (`/api/orders`)
- `GET /statuses` - Get order statuses
- `POST /` - Create order (auth required)
- `GET /` - List my orders (auth required)
- `GET /:id` - Get order details (auth required)
- `POST /:id/progress` - Simulate order progress (auth required)

### Partner (`/api/partner`)
- `POST /register` - Partner registration
- `GET /me` - Get partner profile (auth, cleaner role)
- `PATCH /profile` - Update profile (auth, cleaner role)
- `PATCH /prices` - Update prices (auth, cleaner role)
- `GET /dashboard` - Get dashboard stats (auth, cleaner role)
- `GET /earnings` - Get earnings (auth, cleaner role)
- `GET /orders` - List partner orders (auth, cleaner role)
- `GET /orders/:id` - Get order details (auth, cleaner role)
- `POST /orders/:id/accept` - Accept order (auth, cleaner role)
- `POST /orders/:id/reject` - Reject order (auth, cleaner role)
- `PATCH /orders/:id/status` - Update order status (auth, cleaner role)

### Delivery (`/api/delivery`)
- `POST /register` - Delivery partner registration
- `GET /me` - Get delivery profile (auth, delivery role)
- `PATCH /profile` - Update profile (auth, delivery role)
- `POST /toggle-online` - Toggle online status (auth, delivery role)
- `PATCH /location` - Update location (auth, delivery role)
- `GET /deliveries` - Get available deliveries (auth, delivery role)
- `POST /deliveries/:id/accept` - Accept delivery (auth, delivery role)
- `PATCH /deliveries/:id/status` - Update delivery status (auth, delivery role)
- `GET /earnings` - Get earnings (auth, delivery role)

### Admin (`/api/admin`)
- `GET /dashboard` - Get platform stats (auth, admin role)
- `GET /users` - List users (auth, admin role)
- `GET /cleaners` - List cleaners (auth, admin role)
- `POST /cleaners/:id/approve` - Approve cleaner (auth, admin role)
- `POST /cleaners/:id/reject` - Reject cleaner (auth, admin role)
- `GET /delivery-partners` - List delivery partners (auth, admin role)
- `POST /delivery-partners/:id/approve` - Approve delivery partner (auth, admin role)
- `POST /delivery-partners/:id/reject` - Reject delivery partner (auth, admin role)
- `GET /orders` - List orders (auth, admin role)
- `GET /revenue` - Get revenue stats (auth, admin role)

## Environment variables

See `server/.env.example` for required server config.

## Database Models

### User
- `name`, `phone`, `email`, `password`
- `role`: customer, cleaner, delivery, admin
- `addresses`: Array of address objects

### Cleaner
- `user`: Reference to User
- `shopName`, `ownerName`, `phone`
- `address`: Shop location
- `rating`, `reviewCount`, `deliveryHours`, `deliveryFee`
- `status`: pending, approved, rejected, suspended
- `services`: Array of service categories
- `prices`: Array of price items
- `bankDetails`: Account info
- `isFeatured`: Featured cleaner flag

### DeliveryPartner
- `user`: Reference to User
- `name`, `phone`
- `vehicleType`: bike, scooter, cycle
- `vehicleNumber`, `area`
- `address`: Partner location
- `documents`: Aadhar, DL, RC
- `status`: pending, approved, rejected, suspended, active, offline
- `isOnline`: Online status
- `currentLocation`: GPS coordinates
- `rating`, `deliveryCount`, `totalEarnings`
- `commissionRate`: Platform commission

### Order
- `orderNumber`: Unique order ID
- `customer`: Reference to User
- `cleaner`: Reference to Cleaner
- `assignedDeliveryPartner`: Reference to DeliveryPartner
- `items`: Array of order items
- `subtotal`, `deliveryFee`, `total`
- `pickupSlot`: Date and time window
- `deliveryAddress`: Delivery location
- `paymentMethod`: online, cod
- `paymentStatus`: pending, paid, failed, refunded
- `cleanerDecision`: pending, accepted, rejected
- `status`: pickup_scheduled, picked_up, cleaning_started, quality_check, out_for_delivery, delivered, cancelled
- `statusHistory`: Array of status changes
- `deliveryOtp`: OTP for delivery confirmation

## Order Flow

1. **Customer** places order → status: `pickup_scheduled`
2. **Delivery Partner** picks up clothes → status: `picked_up`
3. **Delivery Partner** delivers to cleaner → status: `cleaning_started`
4. **Cleaner** completes cleaning → status: `quality_check`
5. **Delivery Partner** picks up from cleaner → status: `out_for_delivery`
6. **Delivery Partner** delivers to customer (OTP verification) → status: `delivered`

## Revenue Model

- **Commission**: Platform takes 15% from cleaner earnings
- **Delivery Fee**: Customer pays ₹40-50, partner gets 60-70%, platform keeps rest
- **Subscription**: Future - CleanGo Plus for customers, premium for cleaners

## Future Enhancements

- Razorpay payment integration
- Google Maps for location services
- Cloudinary for image uploads
- AI clothes detection from photos
- Quality protection with before/after photos
- Smart cleaner ranking algorithm
- Society/bulk order mode
- Subscription system (CleanGo Plus)

## License

MIT
