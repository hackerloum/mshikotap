'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import toast from 'react-hot-toast'
import { Database } from '../../lib/supabase'

interface WithdrawalFormProps {
  currentBalance: number
}

export default function WithdrawalForm({ currentBalance }: WithdrawalFormProps) {
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState({
    type: 'mobile_money',
    number: '',
  })
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!amount || isNaN(Number(amount))) {
      toast.error('Please enter a valid amount')
      return
    }

    const withdrawalAmount = Number(amount)
    
    if (withdrawalAmount > currentBalance) {
      toast.error('Insufficient balance')
      return
    }

    if (withdrawalAmount < 5) {
      toast.error('Minimum withdrawal amount is $5')
      return
    }

    if (!paymentMethod.number) {
      toast.error('Please enter payment details')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.from('withdrawals').insert({
        amount: withdrawalAmount,
        payment_method: paymentMethod,
        status: 'pending',
      })

      if (error) throw error

      toast.success('Withdrawal request submitted successfully')
      router.refresh()
      setAmount('')
      setPaymentMethod({ type: 'mobile_money', number: '' })
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount ($)
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input-field mt-1 w-full"
          placeholder="Enter amount"
          min="5"
          step="0.01"
          required
        />
      </div>

      <div>
        <label htmlFor="paymentNumber" className="block text-sm font-medium text-gray-700">
          Mobile Money Number
        </label>
        <input
          type="tel"
          id="paymentNumber"
          value={paymentMethod.number}
          onChange={(e) =>
            setPaymentMethod({ ...paymentMethod, number: e.target.value })
          }
          className="input-field mt-1 w-full"
          placeholder="Enter mobile money number"
          required
        />
      </div>

      <button
        type="submit"
        className="btn-primary w-full"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Request Withdrawal'}
      </button>

      <p className="text-sm text-gray-500">
        Minimum withdrawal: $5. Requests are processed within 24 hours.
      </p>
    </form>
  )
} 