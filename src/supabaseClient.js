import { createClient } from '@supabase/supabase-js'

// Supabase project configuration
// Using environment variables for deployment flexibility
const supabaseUrl = "https://rumtvjcktqmolbawblpg.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1bXR2amNrdHFtb2xiYXdibHBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwMjMyNDMsImV4cCI6MjA5OTU5OTI0M30.olJkp1elZHDmPg6L8JBOiNJOFCRjhhSrASZY2hLAqtI"

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please create a .env file based on .env.example'
  )
}

// Log environment check (only in development)
if (import.meta.env.DEV) {
  console.log('Supabase configured successfully')
  console.log('Project URL:', supabaseUrl)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
