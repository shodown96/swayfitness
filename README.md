# SwayFitness - Gym Membership Managemnt App

SwayFitness is a fullstack gym management platform built with **Next.js (App Router)**. It provides gym owners and managers with tools to register members, track subscriptions, process check-ins, manage plans, and view key metrics. The project makes heavy use of **API Routes**, **server actions**, and **Prisma ORM**, API routes were mainly used making it flexible enough to separate the API layer into a standalone service in the future.

## 🛠 Tech Stack

### Frontend & Framework
- **Next.js (App Router)**
- **React**
- **TailwindCSS** for styling
- **Server Components + Server Actions**
- **API Routes** for backend logic

### Backend & Database
- **Prisma ORM**
- **PostgreSQL** (or SQLite during development)

### Additional Tools
- **Zod & Formik** for validation (optional)


###  Install dependencies
```bash
yarn install
```

###  Create environment variables
Duplicate the `.env.example` file and rename one of them to `.env`.
Assign actual values to the variables.

###  Run Prisma migrations
```bash
yarn db:migrate
```

###  Start the local server
```bash
yarn dev
```

## Deployment
This project can easily be deployed on Vercel.