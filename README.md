# Mshiko Tap - Earn Money Completing Tasks

Mshiko Tap is a modern web platform that allows users to earn money by completing various online tasks such as watching YouTube videos, TikTok, Instagram content, taking surveys, visiting websites, and testing applications.

## Features

- **User Authentication**: Secure login and registration with NextAuth and Supabase
- **Task Marketplace**: Browse and complete various types of tasks
- **Task Management**: For admins to create, update, and manage tasks
- **Earnings Dashboard**: Track earnings, completed tasks, and payout history
- **Withdrawal System**: Request withdrawals of earned money
- **Admin Panel**: Comprehensive admin dashboard to manage users, tasks, and payouts

## Tech Stack

- **Frontend**: React, Next.js, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Supabase
- **Authentication**: NextAuth.js with Supabase integration
- **Database**: PostgreSQL (via Supabase)
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Supabase account for database and authentication
- Environment variables setup

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mshikotap.git
   cd mshikotap
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Supabase Setup

1. Create a new Supabase project
2. Set up the following tables:
   - users
   - user_profiles
   - tasks
   - user_tasks
   - withdrawal_requests

3. Create RLS policies for proper security
4. Set up authentication providers as needed

## Deployment

The application is configured for easy deployment on Netlify. Connect your GitHub repository to Netlify and set the required environment variables in the Netlify dashboard.

## Project Structure

```
mshikotap/
├── components/         # React components
│   ├── admin/          # Admin panel components
│   ├── layouts/        # Layout components
│   ├── tasks/          # Task-related components
│   └── ui/             # UI components (buttons, cards, etc.)
├── lib/                # Library code (Supabase client, etc.)
├── pages/              # Next.js pages
│   ├── api/            # API routes
│   ├── admin/          # Admin pages
│   ├── auth/           # Authentication pages
│   └── dashboard/      # User dashboard pages
├── public/             # Static assets
├── styles/             # Global styles
└── types/              # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/) 