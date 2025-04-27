import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { Database } from '../../../lib/database.types'

export async function GET() {
  try {
    // Initialize Supabase client with environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
    
    // Test connection by checking if we can access public schema
    const { data, error } = await supabase.from('tasks').select('id').limit(1)
    
    if (error) {
      return NextResponse.json(
        { success: false, message: 'Connection failed', error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Connection successful',
      data: { tasksAccessible: true }
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Connection failed', error: err.message },
      { status: 500 }
    )
  }
} 