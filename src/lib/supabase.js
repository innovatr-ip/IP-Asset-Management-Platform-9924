import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://iklzabwsdkxfraetbuiz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrbHphYndzZGt4ZnJhZXRidWl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NjI2MDgsImV4cCI6MjA2NTUzODYwOH0.j4eM9t7jjN-gN34n84PZsar67P3x6SbeC3lAqDjK__E'

if(SUPABASE_URL == 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY == '<ANON_KEY>' ){
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})