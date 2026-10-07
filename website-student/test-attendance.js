import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yahvddokdffidkywmxqe.supabase.co';
const supabaseKey = 'sb_publishable_Lq96lovf6MB_jA95-vyVDg_wvbfGjkf';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAttendance() {
  console.log("Fetching 'attendance' table...");
  const { data, error } = await supabase.from('attendance').select('*').limit(1);
  
  if (error) {
    console.error("Error with 'attendance':", error.message);
  } else {
    console.log("Success! Data:", data);
    if (data.length > 0) {
      console.log("Columns:", Object.keys(data[0]));
    } else {
      console.log("Table exists, but it is empty.");
    }
  }
}

checkAttendance();
