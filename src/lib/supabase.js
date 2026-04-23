import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://njmibithreklfiwuajsd.supabase.co';
const supabaseAnonKey = 'sb_publishable_GiPNqpBbdk8upVORr7uZOA_hFnQOlrX';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
