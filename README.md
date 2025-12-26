# Payment Orchestration Platform - Frontend

A modern, full-featured frontend application for the Payment Orchestration Platform built with Next.js, TypeScript, and Tailwind CSS.

## 📋 Overview

This frontend application provides a comprehensive interface for managing payments, accounts, transactions, payment methods, and compliance rules. It integrates seamlessly with the Payment Orchestration Platform backend services through a unified API Gateway.

## 🚀 Tech Stack

- **Framework**: Next.js 16.0.7 (React 19.2.0)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI + Shadcn/ui
- **HTTP Client**: Axios
- **State Management**: React Hooks (useState, useEffect, Context)
- **Authentication**: JWT (Access Token + Refresh Token)
- **Notifications**: Sonner (Toast notifications)
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🏗️ Architecture

### Project Structure

```
Payment-Orchestration-Platform-Frontend/
├── app/                          # Next.js app directory
│   ├── (auth)/                  # Authentication routes
│   │   ├── login/               # Login page
│   │   └── register/            # Registration page
│   ├── dashboard/               # Dashboard routes
│   │   ├── accounts/            # Accounts management
│   │   ├── transactions/        # Transaction history
│   │   ├── payment-intents/     # Payment intents
│   │   ├── payment-methods/     # Payment methods
│   │   └── compliance/          # Compliance & fraud rules
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── dashboard-layout.tsx
│   │   ├── dashboard-content.tsx
│   │   ├── accounts-content.tsx
│   │   ├── transactions-content.tsx
│   │   ├── payment-intents-content.tsx
│   │   ├── payment-methods-content.tsx
│   │   └── compliance-content.tsx
│   └── ui/                      # Reusable UI components (Shadcn/ui)
├── lib/                          # Utilities and services
│   ├── api/                     # API client configuration
│   │   └── client.ts            # Axios instance with interceptors
│   ├── services/                # API service layer
│   │   ├── auth-service.ts      # Authentication
│   │   ├── user-service.ts      # User management
│   │   ├── account-service.ts   # Accounts & transactions
│   │   ├── payment-method-service.ts
│   │   ├── payment-intent-service.ts
│   │   ├── subscription-service.ts
│   │   └── compliance-service.ts
│   ├── hooks/                   # Custom React hooks
│   │   └── use-auth.ts          # Authentication hook
│   └── contexts/                # React contexts
│       └── theme-context.tsx    # Theme provider
└── public/                       # Static assets
```

## ✨ Features

### 🔐 Authentication

- User registration with email, username, and password
- Secure login with JWT token management
- Automatic token refresh
- Protected routes with authentication checks
- User profile management

### 💳 Payment Management

- **Accounts**: Create and manage financial accounts
  - View account balance and details
  - Create checking, savings, or custom account types
  - Real-time account status updates
- **Transactions**: Complete transaction history
  - View all transactions across all accounts
  - Transaction details (type, amount, status, date)
  - Sorted by date (newest first)
- **Payment Methods**: Manage payment methods
  - Add payment methods (card, bank account, wallet, crypto)
  - Set default payment method
  - Delete payment methods
- **Payment Intents**: Create and manage payment intents
  - Create payment intents with amount and currency
  - Track intent status
  - _Note: Backend service returns 501 (Not Implemented)_

### 🛡️ Compliance

- View fraud detection rules
- Compliance rule management
- Risk assessment display

### 📊 Dashboard

- Real-time statistics:
  - Total accounts count
  - Total transactions count
  - Total payment volume
  - Payment intents count
- Quick actions for common tasks
- Recent activity feed

## 🔌 API Integration

### Backend Services

The frontend communicates with the backend through an API Gateway (`http://localhost:3000`):

#### Authentication Service (`/auth`, `/users`)

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh-token` - Token refresh
- `GET /users/me` - Get current user
- `PUT /users/me` - Update user profile
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id/status` - Update user status

#### Payment Methods (`/users/:user_id/payment-methods`)

- `GET /users/:user_id/payment-methods` - List payment methods
- `POST /users/:user_id/payment-methods` - Add payment method
- `GET /users/:user_id/payment-methods/:method_id` - Get payment method
- `PUT /users/:user_id/payment-methods/:method_id/default` - Set default
- `DELETE /users/:user_id/payment-methods/:method_id` - Delete method

#### Core Banking (`/core`)

- `POST /core/accounts` - Create account
- `GET /core/accounts/user/:user_id` - Get user accounts
- `GET /core/accounts/:account_id` - Get account details
- `GET /core/accounts/:account_id/transactions` - Get account transactions
- `POST /core/transactions/transfer` - Transfer funds
- `POST /core/transactions/deposit` - Deposit funds
- `POST /core/transactions/withdrawal` - Withdraw funds

#### Compliance (`/compliance`)

- `GET /compliance/fraud-rules` - Get fraud rules
- `POST /compliance/check` - Check compliance
- `GET /compliance/logs/:transaction_id` - Get compliance logs

#### Payment Intents (`/payment-intents`)

- _Service not implemented in backend (returns 501)_
- Frontend is ready and will work when backend is implemented

### API Client Configuration

The API client (`lib/api/client.ts`) includes:

- Automatic JWT token injection in request headers
- Token refresh on 401 errors
- Error handling and retry logic
- Base URL configuration via environment variables

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend services running (API Gateway on port 3000)

### Installation

1. **Clone the repository**

   ```bash
   cd frontend_repo/Payment-Orchestration-Platform-Frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000` (or the port shown in terminal)

### Build for Production

```bash
npm run build
npm start
```

## 📦 Service Layer

All API interactions are abstracted through service classes:

### Auth Service (`auth-service.ts`)

- `register()` - Register new user
- `login()` - Authenticate user
- `refreshToken()` - Refresh access token
- `getCurrentUser()` - Get current user profile
- `logout()` - Clear tokens
- `isAuthenticated()` - Check auth status

### Account Service (`account-service.ts`)

- `createAccount()` - Create new account
- `getUserAccounts()` - Get all user accounts
- `getAccount()` - Get account details
- `getAccountTransactions()` - Get account transactions
- `transferFunds()` - Transfer between accounts
- `depositFunds()` - Deposit funds
- `withdrawFunds()` - Withdraw funds
- `getTransaction()` - Get transaction details
- `reverseTransaction()` - Reverse a transaction

### Payment Method Service (`payment-method-service.ts`)

- `getPaymentMethods()` - List payment methods
- `createPaymentMethod()` - Add payment method
- `getPaymentMethod()` - Get payment method details
- `setDefaultPaymentMethod()` - Set default method
- `deletePaymentMethod()` - Remove payment method

### Other Services

- **User Service**: User profile management
- **Subscription Service**: Subscription management
- **Compliance Service**: Fraud rules and compliance checks
- **Payment Intent Service**: Payment intent management (ready for backend)

## 🎨 UI Components

Built with Shadcn/ui components:

- Buttons, Cards, Dialogs
- Tables, Forms, Inputs
- Badges, Toasts
- Navigation menus
- Theme toggle (light/dark mode)

## 🔄 Data Flow

1. **User Action** → Component triggers service method
2. **Service Layer** → Makes API call via Axios client
3. **API Client** → Adds auth token, handles errors
4. **Backend** → Processes request, returns data
5. **Component** → Updates state, re-renders UI
6. **Toast Notification** → Shows success/error message

## 🚨 Error Handling

- All API calls include try-catch blocks
- Error messages extracted from API responses
- Toast notifications for user feedback
- Graceful handling of 401 (unauthorized) errors with token refresh
- Proper error states in UI components

## 📱 Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Adaptive navigation
- Touch-friendly interactions

## 🌙 Theme Support

- Light and dark mode
- System preference detection
- Persistent theme selection
- Smooth theme transitions

## 🔒 Security Features

- JWT token storage in localStorage
- Automatic token refresh
- Protected routes
- Secure API communication
- Input validation

## 📊 Real-time Data Fetching

All components fetch data from backend:

- **Accounts**: Fetches from `/core/accounts/user/:user_id`
- **Transactions**: Aggregates from all user accounts
- **Payment Methods**: Fetches from `/users/:user_id/payment-methods`
- **Compliance**: Fetches from `/compliance/fraud-rules`
- **Dashboard Stats**: Calculated from real backend data

## 🚀 Deployment

### Vercel Deployment

The project is configured for Vercel deployment:

- Framework: Next.js
- Build command: `npm run build`
- Output directory: `.next`
- Environment variables configured in Vercel dashboard

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://your-api-gateway-url.com
```

## 📝 Development Notes

### Adding New Features

1. Create service method in appropriate service file
2. Add TypeScript interfaces for request/response
3. Create or update component to use the service
4. Add error handling and loading states
5. Test with backend API

### API Integration Checklist

- ✅ Authentication endpoints
- ✅ User management endpoints
- ✅ Account management endpoints
- ✅ Transaction endpoints
- ✅ Payment method endpoints
- ✅ Compliance endpoints
- ⚠️ Payment intents (backend returns 501)
- ⚠️ Subscriptions (endpoints available, UI can be enhanced)

## 🐛 Known Issues

- Payment intents service returns 501 (Not Implemented) - Frontend is ready
- Some endpoints may return 404 if backend services aren't fully implemented
- Transaction aggregation may be slow with many accounts (consider pagination)

## 📄 License

Private project - All rights reserved

## 👥 Contributing

This is a private project. For contributions, contact the project maintainer.

---

**Last Updated**: December 2025
**Version**: 0.1.0
