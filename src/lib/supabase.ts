//this for upload users cv in supabase application 

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient (
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

