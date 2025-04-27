'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { FaCopy } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { Database } from '../../../lib/supabase'

export default function ReferralsPage() {
  const [user, setUser] = useState<any>(null)
  const [referrals, setReferrals] = useState<any[]>([])
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        const { data: referralsData } = await supabase
          .from('users')
          .select('*')
          .eq('referred_by', userData?.referral_code)

        setUser(userData)
        setReferrals(referralsData || [])
      }
    }

    fetchData()
  }, [])

  const copyReferralCode = async () => {
    if (user?.referral_code) {
      await navigator.clipboard.writeText(user.referral_code)
      toast.success('Referral code copied to clipboard!')
    }
  }
  
  const copyReferralLink = async () => {
    if (user?.referral_code) {
      const baseUrl = window.location.origin
      const referralLink = `${baseUrl}/auth/signup?ref=${user.referral_code}`
      await navigator.clipboard.writeText(referralLink)
      toast.success('Referral link copied to clipboard!')
    }
  }

  return (
    <div className="space-y-6">
      {/* Referral Code Card */}
      <div className="card bg-primary p-6 text-white">
        <h2 className="text-lg font-medium">Your Referral Code</h2>
        <div className="mt-2 flex items-center space-x-2">
          <p className="text-4xl font-bold">{user?.referral_code}</p>
          <button
            onClick={copyReferralCode}
            className="rounded-lg bg-white/20 p-2 hover:bg-white/30"
            title="Copy referral code"
          >
            <FaCopy className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4">
          <button
            onClick={copyReferralLink}
            className="flex items-center space-x-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium hover:bg-white/30"
          >
            <FaCopy className="h-4 w-4" />
            <span>Copy signup link with your referral code</span>
          </button>
        </div>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900">Total Referrals</h3>
          <p className="mt-2 text-3xl font-bold text-primary">
            {referrals.length}
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900">Total Earnings</h3>
          <p className="mt-2 text-3xl font-bold text-primary">
            ${(referrals.length * 1).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Referral List */}
      <div className="card">
        <h2 className="mb-4 text-lg font-medium text-gray-900">
          Referred Users
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Bonus Earned
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {referrals.map((referral) => (
                <tr key={referral.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {referral.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {new Date(referral.created_at).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    $1.00
                  </td>
                </tr>
              ))}
              {referrals.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No referrals yet. Share your code to start earning!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 