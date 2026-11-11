const { createClient } = require('@supabase/supabase-js');

const SITE_CONTENT_ID = 1;
const PUBLIC_SECTIONS = ['hero', 'about', 'skills', 'projects', 'contact'];

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
    console.error('   Set both in backend/.env (local) or in the Render environment.');
    process.exit(1);
}

// The service_role key bypasses RLS. It must only ever live on the server.
const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
});

// Returns the single site_content row, creating it if the table is empty.
async function getSiteContent() {
    const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('id', SITE_CONTENT_ID)
        .maybeSingle();
    if (error) throw error;
    if (data) return data;

    const { data: created, error: insertError } = await supabase
        .from('site_content')
        .insert({ id: SITE_CONTENT_ID })
        .select('*')
        .single();
    if (insertError) throw insertError;
    console.log('✅ Created default site content → admin / admin123');
    return created;
}

async function updateSiteContent(fields) {
    const { error } = await supabase
        .from('site_content')
        .update(fields)
        .eq('id', SITE_CONTENT_ID);
    if (error) throw error;
}

// Checks the connection and that schema.sql has been run.
async function checkConnection() {
    await getSiteContent();
    console.log('✅ Supabase connected');
}

module.exports = {
    supabase,
    PUBLIC_SECTIONS,
    getSiteContent,
    updateSiteContent,
    checkConnection
};
