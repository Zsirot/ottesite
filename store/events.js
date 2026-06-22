// Calendar events store.
// Uses Postgres when DATABASE_URL is set (production); otherwise falls back to a
// local JSON file so the app still runs in dev without a database.
// All functions are async so the two backends share one interface.

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const pool = require("./db");

const MAX_EVENTS = 20;
const FIELD_LIMITS = { title: 140, start: 40, location: 160, description: 800, link: 500 };

function clip(value, max) {
  return String(value || "").trim().slice(0, max);
}

// Make a user-entered link usable as an external href without requiring a scheme.
function normalizeLink(raw) {
  const link = String(raw || "").trim();
  if (!link) return "";
  if (link.includes("://") || /^(mailto:|tel:|\/)/i.test(link)) return link;
  return "https://" + link;
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function isUpcoming(e) {
  const d = new Date(e.start);
  return !isNaN(d.getTime()) && d >= startOfToday();
}

function buildRow({ title, start, location, description, link }) {
  return {
    id: crypto.randomUUID(),
    title: clip(title, FIELD_LIMITS.title),
    start: clip(start, FIELD_LIMITS.start),
    location: clip(location, FIELD_LIMITS.location),
    description: clip(description, FIELD_LIMITS.description),
    link: normalizeLink(clip(link, FIELD_LIMITS.link)),
  };
}

/* ============================ Postgres backend ============================ */
const pg = {
  async init() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id uuid PRIMARY KEY,
        title text NOT NULL,
        "start" text NOT NULL,
        location text,
        description text,
        link text,
        created_at timestamptz DEFAULT now()
      )
    `);
  },
  async all() {
    const { rows } = await pool.query(
      `SELECT id, title, "start", location, description, link FROM events ORDER BY "start" ASC`
    );
    return rows;
  },
  async upcoming() {
    return (await pg.all()).filter(isUpcoming);
  },
  async add(input) {
    const { rows } = await pool.query("SELECT COUNT(*)::int AS n FROM events");
    if (rows[0].n >= MAX_EVENTS) return false;
    const r = buildRow(input);
    await pool.query(
      `INSERT INTO events (id, title, "start", location, description, link)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [r.id, r.title, r.start, r.location, r.description, r.link]
    );
    return true;
  },
  async remove(id) {
    await pool.query("DELETE FROM events WHERE id = $1", [id]);
  },
};

/* ============================ Flat-file backend ========================== */
const DATA_DIR = path.join(__dirname, "..", "data");
const FILE = path.join(DATA_DIR, "events.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]");
}
function readAll() {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8")) || [];
  } catch (e) {
    return [];
  }
}
function writeAll(list) {
  ensureFile();
  const tmp = FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(list, null, 2));
  fs.renameSync(tmp, FILE);
}

const file = {
  async init() {},
  async all() {
    return readAll().sort((a, b) => new Date(a.start) - new Date(b.start));
  },
  async upcoming() {
    return (await file.all()).filter(isUpcoming);
  },
  async add(input) {
    const list = readAll();
    if (list.length >= MAX_EVENTS) return false;
    list.push(buildRow(input));
    writeAll(list);
    return true;
  },
  async remove(id) {
    writeAll(readAll().filter((e) => e.id !== id));
  },
};

const backend = pool ? pg : file;

module.exports = {
  init: backend.init,
  all: backend.all,
  upcoming: backend.upcoming,
  add: backend.add,
  remove: backend.remove,
  MAX_EVENTS,
  FIELD_LIMITS,
};
