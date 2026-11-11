// Admin authentication: scrypt password hashing and signed, expiring tokens.
//
// Token format: base64url(JSON payload) + "." + base64url(HMAC-SHA256 signature).
// The signing key mixes in the stored password hash, so changing the admin
// password immediately invalidates every token issued before.

const crypto = require('crypto');
const { getSiteContent } = require('../config/supabase');

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

// Server secret: ADMIN_TOKEN_SECRET if set, otherwise derived from the
// service_role key (already secret and only on the server).
const SERVER_SECRET = process.env.ADMIN_TOKEN_SECRET ||
    crypto.createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY || '')
        .update('portfolio-admin-token')
        .digest();

// ---------- Passwords ----------

function hashPassword(password) {
    const salt = crypto.randomBytes(16);
    const hash = crypto.scryptSync(password, salt, 64);
    return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

function safeEqual(a, b) {
    const bufA = Buffer.from(String(a));
    const bufB = Buffer.from(String(b));
    return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

// Returns { ok, needsUpgrade }. Plain-text passwords (from before hashing was
// added) still work once and are flagged so the caller can store a hash.
function verifyPassword(password, stored) {
    if (typeof password !== 'string' || typeof stored !== 'string') {
        return { ok: false, needsUpgrade: false };
    }
    if (stored.startsWith('scrypt$')) {
        const [, saltHex, hashHex] = stored.split('$');
        const expected = Buffer.from(hashHex, 'hex');
        const actual = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length);
        return { ok: crypto.timingSafeEqual(actual, expected), needsUpgrade: false };
    }
    const ok = safeEqual(password, stored);
    return { ok, needsUpgrade: ok };
}

// ---------- Tokens ----------

function signingKey(storedPassword) {
    return crypto.createHmac('sha256', SERVER_SECRET).update(storedPassword).digest();
}

function sign(payloadPart, storedPassword) {
    return crypto.createHmac('sha256', signingKey(storedPassword))
        .update(payloadPart)
        .digest('base64url');
}

function issueToken(username, storedPassword) {
    const expiresAt = Date.now() + TOKEN_TTL_MS;
    const payloadPart = Buffer.from(JSON.stringify({ u: username, exp: expiresAt })).toString('base64url');
    return { token: `${payloadPart}.${sign(payloadPart, storedPassword)}`, expiresAt };
}

function verifyToken(token, content) {
    if (typeof token !== 'string' || !token.includes('.')) return false;
    const [payloadPart, signature] = token.split('.');
    if (!safeEqual(signature, sign(payloadPart, content.admin_password))) return false;
    try {
        const payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8'));
        return payload.u === content.admin_username && Date.now() < payload.exp;
    } catch {
        return false;
    }
}

// Express middleware: requires "Authorization: Bearer <token>".
async function requireAdmin(req, res, next) {
    try {
        const header = req.get('authorization') || '';
        const token = header.startsWith('Bearer ') ? header.slice(7) : null;
        if (!token) {
            return res.status(401).json({ error: 'Login required' });
        }
        const content = await getSiteContent();
        if (!verifyToken(token, content)) {
            return res.status(401).json({ error: 'Session expired. Please log in again.' });
        }
        next();
    } catch (err) {
        console.error('AUTH ERROR:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

// ---------- Login rate limit (in memory, per IP) ----------

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_LOGINS = 10;
const failedLogins = new Map(); // ip -> { count, resetAt }

function loginBlocked(ip) {
    const entry = failedLogins.get(ip);
    if (!entry) return false;
    if (Date.now() > entry.resetAt) {
        failedLogins.delete(ip);
        return false;
    }
    return entry.count >= MAX_FAILED_LOGINS;
}

function recordFailedLogin(ip) {
    const entry = failedLogins.get(ip);
    if (!entry || Date.now() > entry.resetAt) {
        failedLogins.set(ip, { count: 1, resetAt: Date.now() + LOGIN_WINDOW_MS });
    } else {
        entry.count++;
    }
}

function clearFailedLogins(ip) {
    failedLogins.delete(ip);
}

module.exports = {
    hashPassword,
    verifyPassword,
    issueToken,
    requireAdmin,
    loginBlocked,
    recordFailedLogin,
    clearFailedLogins
};
