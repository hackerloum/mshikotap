'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '../../../lib/supabase'
import WithdrawalForm from '../../../components/wallet/WithdrawalForm'

export default function WalletPage() {
  const [user, setUser] = useState<any>(null)
  const [withdrawals, setWithdrawals] = useState<any[]>([])
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

        const { data: withdrawalsData } = await supabase
          .from('withdrawals')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        setUser(userData)
        setWithdrawals(withdrawalsData || [])
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="card bg-primary p-6 text-white">
        <h2 className="text-lg font-medium">Available Balance</h2>
        <p className="mt-2 text-4xl font-bold">
          ${user?.wallet_balance?.toFixed(2) || '0.00'}
        </p>
      </div>

      {/* Withdrawal Form */}
      <div className="card">
        <h2 className="mb-4 text-lg font-medium text-gray-900">
          Request Withdrawal
        </h2>
        <WithdrawalForm currentBalance={user?.wallet_balance || 0} />
      </div>

      {/* Withdrawal History */}
      <div className="card">
        <h2 className="mb-4 text-lg font-medium text-gray-900">
          Withdrawal History
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {withdrawals.map((withdrawal) => (
                <tr key={withdrawal.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {new Date(withdrawal.created_at).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    ${withdrawal.amount.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        withdrawal.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : withdrawal.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {withdrawal.status}
                    </span>
                  </td>
                </tr>
              ))}
              {withdrawals.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No withdrawal history
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