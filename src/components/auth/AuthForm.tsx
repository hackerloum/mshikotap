'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'

interface AuthFormProps {
  type: 'login' | 'signup'
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Check for referral code in URL parameters when component mounts
  useEffect(() => {
    if (type === 'signup') {
      const refCode = searchParams.get('ref')
      if (refCode) {
        setFormData(prev => ({ ...prev, referralCode: refCode }))
      }
    }
  }, [searchParams, type])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (type === 'signup') {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required'
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required'
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
      
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }
      
      // We validate referral code format only if one is provided
      if (formData.referralCode && formData.referralCode.length !== 8) {
        newErrors.referralCode = 'Referral code must be 8 characters'
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)

    try {
      if (type === 'signup') {
        // If a referral code is provided, check if it exists
        if (formData.referralCode) {
          const { data: referralCheck, error: referralError } = await supabase
            .from('users')
            .select('referral_code')
            .eq('referral_code', formData.referralCode)
            .single()
            
          if (referralError && referralError.code !== 'PGRST116') {
            // PGRST116 is the error code for "no rows returned"
            throw new Error(referralError.message)
          }
          
          if (!referralCheck) {
            setErrors(prev => ({ ...prev, referralCode: 'Invalid referral code' }))
            setLoading(false)
            return
          }
        }
        
        // Generate a unique referral code first
        const newReferralCode = uuidv4().substring(0, 8).toUpperCase();
        
        // Create the auth user with meta data to link to profile
        const { data: { user }, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              phone: formData.phone,
              referral_code: newReferralCode,
              referred_by: formData.referralCode || null
            }
          }
        })
        
        if (signUpError) throw signUpError
        
        // Create user profile in the users table
        if (user) {
          const { error: profileError } = await supabase.from('users').insert({
            id: user.id,
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            wallet_balance: 0,
            referral_code: newReferralCode,
            referred_by: formData.referralCode || null,
          })
          
          if (profileError) {
            console.error("Profile creation error:", profileError);
            throw new Error(`Error creating user profile: ${profileError.message}`);
          }
        }
        
        toast.success('Check your email for the confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })
        if (error) throw error
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Error during registration. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {type === 'signup' && (
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            required
            className={`input-field mt-1 w-full ${errors.fullName ? 'border-red-500' : ''}`}
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          className={`input-field mt-1 w-full ${errors.email ? 'border-red-500' : ''}`}
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {type === 'signup' && (
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            required
            className={`input-field mt-1 w-full ${errors.phone ? 'border-red-500' : ''}`}
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
      )}

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          className={`input-field mt-1 w-full ${errors.password ? 'border-red-500' : ''}`}
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>
      
      {type === 'signup' && (
        <>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              className={`input-field mt-1 w-full ${errors.confirmPassword ? 'border-red-500' : ''}`}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700">
              Referral Code (Optional)
            </label>
            <input
              id="referralCode"
              type="text"
              className={`input-field mt-1 w-full ${errors.referralCode ? 'border-red-500' : ''}`}
              value={formData.referralCode}
              onChange={(e) =>
                setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })
              }
              placeholder="Enter referral code if you have one"
            />
            {errors.referralCode && (
              <p className="mt-1 text-sm text-red-600">{errors.referralCode}</p>
            )}
          </div>
        </>
      )}

      <button
        type="submit"
        className="btn-primary w-full"
        disabled={loading}
      >
        {loading ? 'Loading...' : type === 'signup' ? 'Sign Up' : 'Login'}
      </button>
    </form>
  )
} 