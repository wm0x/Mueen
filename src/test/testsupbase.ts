import { supabase } from "@/lib/supabase";

export async function testSupabaseStorage() {
  const { data, error } = await supabase.storage.from("orders").list();
  if (error) {
    console.error("Supabase Storage connection failed:", error.message);
  } else {
    console.log("Supabase Storage connected! Files:", data);
  }
}

testSupabaseStorage();
