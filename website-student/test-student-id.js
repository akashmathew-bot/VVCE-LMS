import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yahvddokdffidkywmxqe.supabase.co';
const supabaseKey = 'sb_publishable_Lq96lovf6MB_jA95-vyVDg_wvbfGjkf';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable() {
  const tablesToTest = ['id', 'id information', 'id_information', 'student_ids'];
  
  for (const tableName of tablesToTest) {
    console.log(`\nFetching '${tableName}' table...`);
    const { data, error } = await supabase.from(tableName).select('*').limit(5);
    
    if (error) {
      console.error(`Error with '${tableName}':`, error.message);
    } else {
      console.log(`Success '${tableName}':`, data);
    }
  }
}

checkTable();
