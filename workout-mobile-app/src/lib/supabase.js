import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xtazgqpcaujwwaswzeoh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0YXpncXBjYXVqd3dhc3d6ZW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MTA5MDUsImV4cCI6MjA0NzM4NjkwNX0.nFutcV81_Na8L-wwxFRpYg7RhqmjMrYspP2LyKbE_q0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
