// One-time copy of the old MongoDB data into Supabase.
//
// Needs in backend/.env:  MONGO_URI, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Run schema.sql in Supabase first, then from the backend folder:
//   node scripts/migrate-mongo-to-supabase.js
//
// Copies the site content (incl. profile image and admin login) and all
// contact messages. Messages are skipped if the Supabase table already has
// rows, so running it twice does not create duplicates.

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const { supabase, updateSiteContent, getSiteContent } = require('../config/supabase');

async function main() {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not set in backend/.env');
    }

    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 20000 });
    const db = mongoose.connection.db;
    console.log(`✅ MongoDB connected (database: ${db.databaseName})`);

    // ---- Site content ----
    const doc = await db.collection('sitecontents').findOne();
    if (doc) {
        await getSiteContent(); // make sure the row exists
        const fields = {};
        for (const section of ['hero', 'about', 'skills', 'projects', 'contact']) {
            if (doc[section] !== undefined) fields[section] = doc[section];
        }
        if (doc.admin && doc.admin.username) fields.admin_username = doc.admin.username;
        if (doc.admin && doc.admin.password) fields.admin_password = doc.admin.password;
        await updateSiteContent(fields);
        console.log(`  ✓ site content (${Object.keys(fields).join(', ')})`);
    } else {
        console.log('  - no site content found in MongoDB, skipped');
    }

    // ---- Messages ----
    const { count, error: countError } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true });
    if (countError) throw countError;

    if (count > 0) {
        console.log(`  - Supabase already has ${count} message(s), skipped to avoid duplicates`);
    } else {
        const messages = await db.collection('messages').find().sort({ timestamp: 1 }).toArray();
        if (messages.length) {
            const rows = messages.map(m => ({
                name: m.name ?? null,
                email: m.email ?? null,
                subject: m.subject ?? null,
                message: m.message ?? null,
                created_at: (m.timestamp || m._id.getTimestamp()).toISOString()
            }));
            const { error } = await supabase.from('messages').insert(rows);
            if (error) throw error;
        }
        console.log(`  ✓ ${messages.length} message(s)`);
    }

    console.log('Done.');
}

main()
    .catch(err => {
        console.error('Migration failed:', err.message || err);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
