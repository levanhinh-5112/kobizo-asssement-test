Assessment Test

Frontend (Next.js 15):
Product listing, search, and filtering (e.g., out-of-stock products).
Admin-only product editing with middleware-based role checks.
Out-of-stock product count displayed in the header for admins.
Authentication with JWT-based login and refresh tokens.
Client-side data fetching with SWR for real-time updates.


API Gateway (Express.js):
Routes for authentication (/signin, /signup).
Product management (/products, /products/slug).
Blog post retrieval (/blog_posts, /blog_posts/slug).
Checkout


Backend (Directus 11.11.0):
Manages products and directus_users collections.
Supports role-based permissions (admin and user roles).



Prerequisites

Node.js: v18.x or higher
npm: v8.x or higher
Directus: v11.11.0 (running locally or remotely)
Docker (optional, for Directus setup)
Git: For cloning the repository

Project Structure
e-commerce-platform/
├── api-gateway/          # Express.js API gateway
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── services/     # Directus service
│   │   ├── helpers/      # Helpers
│   │   └── app.ts        # Express app setup
│   └── package.json
├── frontend/             # Next.js 15 frontend
│   ├── src/
│   │   ├── app/          # Pages and routes
│   │   ├── components/   # Reusable components
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # API utilities
│   │   └── types/        # TypeScript interfaces
│   └── package.json
└── README.md             # This file

Setup Instructions
1. Clone the Repository
git clone https://github.com/your-repo/e-commerce-platform.git
cd e-commerce-platform

2. Set Up Directus

Option 1: Run Directus Locally with Docker
cd directus
docker-compose up -d


Access Directus at http://localhost:8055.
Create an admin user and note the email/password.


Option 2: Use an Existing Directus Instance

Ensure you have the URL (e.g., http://localhost:8055) and admin credentials.




Seed Data

Add a product with slug: computer-product (e.g., name: Computer Product, price: 999.99, stock_quantity: 10).
Create users:
Admin: email: admin@example.com, password: password, role: admin
Non-Admin: email: user@example.com, password: password, role: user





3. Set Up API Gateway

Navigate to API Gateway Directory
cd api-gateway


Install Dependencies
yarn install


Configure EnvironmentCreate a .env file in api-gateway/:
DIRECTUS_URL=http://localhost:8055
JWT_SECRET=your-secret-key
PORT=3000


Replace DIRECTUS_EMAIL and DIRECTUS_PASSWORD with your Directus service account credentials.
Use secure values for JWT_SECRET and REFRESH_SECRET (e.g., generate with openssl rand -base64 32).


Run API Gateway
yarn dev


The API gateway runs on http://localhost:3000.



4. Set Up Frontend

Navigate to Frontend Directory
cd ../frontend


Install Dependencies
yarn install


Run Frontend
yarn dev


The frontend runs on http://localhost:3001.



5. Verify Setup

API Gateway: Access http://localhost:3000/api/v1/products with an admin JWT (obtained via /signin or access publicly).
Frontend: Visit http://localhost:3001 and log in with admin@example.com or user@example.com.
Directus: Log in at http://localhost:8055 to verify data and permissions.

Usage

Login

Go to http://localhost:3001/login.
Use user@example.com/password.


Product Management

Visit http://localhost:3001/products to view products.
Admins can:
See out-of-stock count in the header (updates after editing products).
Edit products at http://localhost:3001/products/edit/computer-product.


Non-admins attempting to access /products/edit/* are redirected to /login?error=unauthorized.


Blog Posts

View blog posts at http://localhost:3001/blog.


Testing Authentication
curl -X POST "http://localhost:3000/api/v1/signin" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password"}'


Key Features in Action

Out-of-Stock Count:
Displayed in the header for admins (e.g., “Out of Stock: 5”).
Updates automatically after editing stock_quantity via SWR cache invalidation.


Role-Based Access:
Middleware (src/middleware.ts) restricts /products/edit/* to admins.
Non-admins and unauthenticated users are redirected to /login with error query parameters.


JWT Authentication:
Tokens include role (e.g., admin or user) for authorization.
Refresh tokens extend sessions (handled by useAuth hook).

Development Notes

Frontend: Uses Next.js 15 with TypeScript, SWR for data fetching, and Tailwind CSS for styling.
API Gateway: Built with Express.js, integrates with Directus via a service layer.
Security: Cookies are set with sameSite: strict and secure: false (for local http:// testing). Update to secure: true in production.
Dependencies:
Frontend: next, react, swr, axios, js-cookie
API Gateway: express, jsonwebtoken, axios, @directus/sdk