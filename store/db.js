// Shared Postgres pool. Null when DATABASE_URL isn't set (local dev), so the
// app can fall back to the flat-file store and the in-memory session store.
const { Pool } = require("pg");

let pool = null;
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Supabase requires SSL; the pooler cert isn't in Node's default CA bundle.
    ssl: { rejectUnauthorized: false },
    max: 5,
  });
  pool.on("error", (err) => console.error("Postgres pool error:", err.message));
}

module.exports = pool;
