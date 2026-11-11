// Pushes the content in frontend/public/site-content.js to the portfolio API,
// so the live site (which reads from the database) shows it.
//
// Usage (Node 18+):
//   node backend/scripts/sync-content.js                 -> live API on Render
//   node backend/scripts/sync-content.js http://localhost:3001
//
// The profile image already saved in the database is kept as is.

const path = require('path');
const content = require(path.join(__dirname, '../../frontend/public/site-content.js'));

const apiBase = (process.argv[2] || 'https://portfolio-35ll.onrender.com').replace(/\/$/, '');
const endpoint = `${apiBase}/api/content`;

async function main() {
    console.log(`Syncing content to ${endpoint}`);

    // Keep the profile image that is already in the database
    const current = await fetch(endpoint).then(r => {
        if (!r.ok) throw new Error(`GET failed: ${r.status} ${r.statusText}`);
        return r.json();
    });
    const savedImage = current.hero && current.hero.profileImage;

    const hero = { ...content.hero };
    if (savedImage) {
        hero.profileImage = savedImage;
    } else {
        delete hero.profileImage;
    }

    const sections = {
        hero,
        about: content.about,
        skills: content.skills,
        projects: content.projects,
        contact: content.contact
    };

    let failed = 0;
    for (const [section, data] of Object.entries(sections)) {
        const res = await fetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ section, data })
        });
        const body = await res.text();
        if (res.ok) {
            console.log(`  ✓ ${section}`);
        } else {
            failed++;
            console.error(`  ✗ ${section}: ${res.status} ${body}`);
        }
    }

    if (failed) {
        console.error(`${failed} section(s) failed.`);
        process.exit(1);
    }
    console.log('Done. Reload the site to see the new content.');
}

main().catch(err => {
    console.error('Sync failed:', err.message);
    process.exit(1);
});
