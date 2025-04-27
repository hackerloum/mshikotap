import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    if (!supabaseServiceKey) {
      console.error('Service role key not configured')
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
    
    // Validate required fields
    if (!userData.id) {
      console.error('Missing required field: id')
      return NextResponse.json(
        { success: false, message: 'Missing required field: id' },
        { status: 400 }
      )
    }
    
    if (!userData.fullName) {
      console.error('Missing required field: fullName')
      return NextResponse.json(
        { success: false, message: 'Missing required field: fullName' },
        { status: 400 }
      )
    }
    
    if (!userData.email) {
      console.error('Missing required field: email')
      return NextResponse.json(
        { success: false, message: 'Missing required field: email' },
        { status: 400 }
      )
    }

    // Check if the user already exists
    const { data: existingUser, error: existingUserError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', userData.id)
      .single()
      
    if (existingUser) {
      console.log('User already exists, returning success')
      return NextResponse.json({
        success: true,
        message: 'User already exists',
        data: existingUser
      })
    }

    // If a referral code is provided, verify it exists
    let referredByValid = true
    if (userData.referredBy) {
      const { data: referrer, error: referrerError } = await supabaseAdmin
        .from('users')
        .select('referral_code')
        .eq('referral_code', userData.referredBy)
        .single()

      if (referrerError || !referrer) {
        referredByValid = false
        console.error('Invalid referral code:', userData.referredBy)
        return NextResponse.json(
          { success: false, message: 'Invalid referral code' },
          { status: 400 }
        )
      }
    }

    // Generate a unique referral code
    let referralCode: string
    let isUnique = false
    let attempts = 0
    const maxAttempts = 5

    do {
      referralCode = uuidv4().substring(0, 8).toUpperCase()
      const { data: existing, error: checkError } = await supabaseAdmin
        .from('users')
        .select('referral_code')
        .eq('referral_code', referralCode)
        .single()

      if (!existing && !checkError) {
        isUnique = true
      }
      attempts++
    } while (!isUnique && attempts < maxAttempts)

    if (!isUnique) {
      console.error('Failed to generate unique referral code after', maxAttempts, 'attempts')
      return NextResponse.json(
        { success: false, message: 'Failed to generate unique referral code' },
        { status: 500 }
      )
    }
    
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
        referred_by: referredByValid ? userData.referredBy : null,
      })
      .select()
    
    if (error) {
      console.error('Error creating user profile:', error)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Error creating user profile', 
          error: error.message,
          details: error.details || error 
        },
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
      { 
        success: false, 
        message: 'Error creating user profile', 
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
      },
      { status: 500 }
    )
  }
} 