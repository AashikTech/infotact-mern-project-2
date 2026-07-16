# Infotact E-Commerce Project

A high-performance e-commerce engine with AI vector search, Redis caching, and admin dashboard.

## Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB (with Vector Search)
- **Cache**: Redis (Cache-Aside Pattern)
- **Frontend**: React 19 + Vite + Tailwind CSS v4
- **CI/CD**: GitHub Actions

## Project Structure

```
infotact-ecommerce-project/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI pipeline
│
├── server/                     # Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── index.ts        # env config
│   │   │   ├── redis.ts        # Redis client connection
│   │   │   └── mongo.ts        # MongoDB connection
│   │   │
│   │   ├── models/
│   │   │   ├── User.ts         # Admin/Customer users
│   │   │   ├── Product.ts      # Product with vector embedding field
│   │   │   ├── Cart.ts         # Shopping cart
│   │   │   ├── Order.ts        # Orders
│   │   │   └── Discount.ts     # Discount codes
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── productController.ts
│   │   │   ├── cartController.ts
│   │   │   └── orderController.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── productRoutes.ts
│   │   │   ├── cartRoutes.ts
│   │   │   └── orderRoutes.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.ts         # JWT auth
│   │   │   └── errorHandler.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── cache.ts        # Redis cache helpers
│   │   │   ├── embedding.ts    # Generate vector embeddings
│   │   │   └── transform.ts
│   │   │
│   │   ├── scripts/
│   │   │   └── seed.ts         # Seed thousands of products
│   │   │
│   │   └── index.ts
│   │
│   ├── tests/
│   ├── .env
│   ├── Dockerfile
│   └── package.json
│
└── client/                     # Admin Dashboard (React 19 + Vite + Tailwind)
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (v6+)
- Redis (v7+)

### Installation

```bash
# Clone the repository
git clone https://github.com/AashikTech/infotact-mern-project-2.git
cd infotact-mern-project-2

# Setup server
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Available Scripts

**Server:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run seed` - Seed database with sample products
- `npm run lint` - Run linter
- `npm run format` - Format code with Prettier

## Learning Concepts

### 1. Cache-Aside Pattern (Redis)
- Check Redis first for cached data
- On cache miss, fetch from MongoDB and cache the result
- Sub-50ms response times for cached data

### 2. Cache Invalidation
- Delete Redis keys when data is updated
- Ensures users always see fresh data

### 3. Vector Search (AI Semantic Search)
- Convert product descriptions to embeddings
- Find products by meaning, not just keywords
- "warm winter jackets" matches "Insulated Snow Coat"

### 4. CI/CD (Continuous Integration)
- Automated testing on every push
- Code quality checks via GitHub Actions

## License

ISC
