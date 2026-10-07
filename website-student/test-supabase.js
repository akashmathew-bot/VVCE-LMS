import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable() {
  console.log("Fetching students table...");
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .limit(5);
  if (error) {
    console.error("Error fetching students:", error);
  } else {
    console.log("Students found:", data);
  }
}
checkTable();
