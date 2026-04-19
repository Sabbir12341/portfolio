const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema({
    hero: {
        title: String,
        subtitle: String,
        tagline: String,
        profileImage: String
    },
    about: {
        paragraph1: String,
        paragraph2: String,
        paragraph3: String
    },
    skills: Array,
    projects: Array,
    contact: {
        email: String,
        linkedin: String,
        github: String
    },
    admin: {
        username: String,
        password: String
    }
}, { timestamps: true });

module.exports = mongoose.model('SiteContent', siteContentSchema);
