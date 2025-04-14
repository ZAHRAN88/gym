# Gym Management System

A modern, full-stack gym management system built with Next.js, TypeScript, and Tailwind CSS. This application helps gym owners and staff manage members, check-ins, and subscriptions efficiently.

## Features

- **Member Management**
  - Add, edit, and view member details
  - Track member check-ins
  - Manage member subscriptions

- **Check-in System**
  - QR code scanning for quick check-ins
  - Manual member ID entry
  - Real-time validation of member status

- **Dashboard**
  - Overview of key metrics
  - Member statistics
  - Check-in analytics
  - Revenue tracking

- **Authentication**
  - Secure login system
  - Role-based access control
  - Session management

- **Responsive Design**
  - Mobile-friendly interface
  - Modern UI components
  - Dark/Light mode support

## Tech Stack

- **Frontend**
  - Next.js 15
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components
  - Lucide Icons

- **Backend**
  - Next.js API Routes
  - NextAuth.js for authentication
  - Prisma ORM
  

- **Database**
  - Sqlite

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ZAHRAN88/gym.git
   cd gym
   ```

2. Install dependencies:
   ```bash
   npm npm i --legacy-peer-deps
  
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
gym-management/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── members/           # Member management pages
│   └── check-in/          # Check-in system
├── components/            # Reusable components
│   ├── ui/               # UI components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
├── prisma/              # Database schema and migrations
└── public/              # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/)
