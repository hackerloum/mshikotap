# MshikoTap - Earn As You Tap

MshikoTap is a platform where users can complete simple tasks like watching videos, following social media accounts, filling surveys, or visiting websites to earn money.

## Features

- User authentication with email/password
- Referral system to earn bonuses for inviting friends
- Task dashboard showing available tasks
- Wallet management for tracking earnings
- Withdrawal system for cashing out earnings

## Tech Stack

- Next.js 14 (React framework)
- TypeScript
- Tailwind CSS for styling
- Supabase for authentication and database

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Referral System

The platform includes a referral system that works as follows:

1. When users sign up, they automatically receive a unique 8-character referral code
2. Users can share their referral code or a direct signup link with their code embedded
3. When new users sign up using a referral code, they are linked to the referrer
4. Referrers earn a $1.00 bonus for each successful referral

### How to Use the Referral System

1. Navigate to the Referrals page in the dashboard
2. Copy your referral code or use the "Copy signup link" button
3. Share the link with friends
4. When they sign up using your link or manually enter your code, you'll receive credit

## Database Schema

The application uses a PostgreSQL database with the following main tables:

- `users` - User profiles and wallet information
- `tasks` - Available tasks for users to complete
- `task_completions` - Records of completed tasks
- `withdrawals` - Withdrawal requests and their status

## API Testing

You can test the Supabase connection by visiting `/api/test-connection` endpoint.

## Security

This project implements Row Level Security (RLS) policies to ensure users can only access their own data.

## Deployment

1. Create an account on Vercel or Railway.app
2. Connect your repository
3. Set the environment variables
4. Deploy!

## Security Considerations

- All user IDs and task IDs are randomly generated
- API calls are protected with authentication
- Task completion is verified server-side
- Withdrawal system has daily limits
- Admin approval required for payouts

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - [@yourusername](https://twitter.com/yourusername)
Project Link: [https://github.com/yourusername/mshikotap](https://github.com/yourusername/mshikotap) 