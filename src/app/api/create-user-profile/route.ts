import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    if (!supabaseServiceKey) {
      return NextResponse.json(
        { success: false, message: 'Service role key not configured' },
        { status: 500 }
      )
    }
    
    // Create a Supabase client with admin privileges
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    // Get the user data from the request
    const userData = await request.json()
    
    // Generate a unique referral code if not provided
    const referralCode = userData.referralCode || uuidv4().substring(0, 8).toUpperCase()
    
    // Insert the user profile
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        id: userData.id,
        full_name: userData.fullName,
        email: userData.email,
        phone: userData.phone || '',
        wallet_balance: 0,
        referral_code: referralCode,
        referred_by: userData.referredBy || null,
      })
      .select()
    
    if (error) {
      console.error('Error creating user profile:', error)
      return NextResponse.json(
        { success: false, message: 'Error creating user profile', error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'User profile created successfully',
      data
    })
  } catch (err: any) {
    console.error('Exception creating user profile:', err)
    return NextResponse.json(
      { success: false, message: 'Error creating user profile', error: err.message },
      { status: 500 }
    )
  }
} 