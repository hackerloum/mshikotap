import Link from 'next/link'
import { FaMoneyBillWave, FaTasks, FaUserFriends, FaWallet } from 'react-icons/fa'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
              MshikoTap - Earn As You Tap
            </h1>
            <p className="mb-8 text-xl">
              Complete simple tasks and earn money instantly. Start earning today!
            </p>
            <div className="space-x-4">
              <Link href="/auth/signup" className="btn-secondary bg-white">
                Get Started
              </Link>
              <Link href="/auth/login" className="btn-secondary">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Why Choose MshikoTap?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<FaTasks className="h-8 w-8" />}
              title="Simple Tasks"
              description="Watch videos, follow accounts, and complete surveys to earn money"
            />
            <FeatureCard
              icon={<FaMoneyBillWave className="h-8 w-8" />}
              title="Instant Rewards"
              description="Get paid immediately after completing tasks"
            />
            <FeatureCard
              icon={<FaWallet className="h-8 w-8" />}
              title="Quick Withdrawals"
              description="Request payouts and receive money within 24 hours"
            />
            <FeatureCard
              icon={<FaUserFriends className="h-8 w-8" />}
              title="Referral Bonus"
              description="Invite friends and earn extra rewards"
            />
          </div>
        </div>
      </section>
    </main>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="card text-center">
      <div className="mb-4 flex justify-center text-primary">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
} 