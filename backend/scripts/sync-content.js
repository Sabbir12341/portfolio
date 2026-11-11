// Writes the content in frontend/public/site-content.js straight to Supabase,
// so the live site (which reads from the database) shows it.
//
// Needs SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env.
// Usage (from the repo root):
//   node backend/scripts/sync-content.js
//
// The profile image already saved in the database is kept as is.

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env'), quiet: true });
const { getSiteContent, updateSiteContent } = require('../config/supabase');
const content = require(path.join(__dirname, '../../frontend/public/site-content.js'));

async function main() {
    const current = await getSiteContent();

    // Keep the profile image that is already in the database
    const hero = { ...content.hero };
    const savedImage = current.hero && current.hero.profileImage;
    if (savedImage) {
        hero.profileImage = savedImage;
    } else {
        delete hero.profileImage;
    }

    await updateSiteContent({
        hero,
        about: content.about,
        skills: content.skills,
        projects: content.projects,
        contact: content.contact
    });

    console.log('✓ hero, about, skills, projects, contact synced to Supabase');
    console.log('Reload the site to see the new content.');
}

main().catch(err => {
    console.error('Sync failed:', err.message || err);
    process.exit(1);
});
