import { createClient } from '@supabase/supabase-js';

export const environment = {
  production: false,
  supabaseUrl: 'https://frvbgelsldkluitdztel.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZydmJnZWxzbGRrbHVpdGR6dGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MjgwODIsImV4cCI6MjA2OTAwNDA4Mn0.kgFqhgEiTabNevKzezqVnI5YygdrPinSDO2JvdhckbU'
};

export const supabase = createClient(
  environment.supabaseUrl,
  environment.supabaseKey
);
