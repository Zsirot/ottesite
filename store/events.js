// Tiny flat-file store for calendar events.
// One JSON file on disk — perfect for a single editor with infrequent events,
// durable on a persistent server, and with no native dependency to build.

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

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
  // Write to a temp file then rename — an atomic swap, so a crash mid-write
  // can never leave a half-written events file.
  const tmp = FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(list, null, 2));
  fs.renameSync(tmp, FILE);
}

// Make a user-entered link usable as an external href without requiring them
// to type the scheme. A bare "example.com" becomes "https://example.com";
// anything already schemed (http(s)://, mailto:, tel:) or relative ("/x") is left alone.
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

// All events, soonest first.
function all() {
  return readAll().sort((a, b) => new Date(a.start) - new Date(b.start));
}

// Only events happening today or later, soonest first.
function upcoming() {
  const cutoff = startOfToday();
  return all().filter((e) => {
    const d = new Date(e.start);
    return !isNaN(d.getTime()) && d >= cutoff;
  });
}

const MAX_EVENTS = 20;
const FIELD_LIMITS = { title: 140, start: 40, location: 160, description: 800, link: 500 };

function clip(value, max) {
  return String(value || "").trim().slice(0, max);
}

// Returns false if the calendar is already at capacity (caller surfaces a message).
function add({ title, start, location, description, link }) {
  const list = readAll();
  if (list.length >= MAX_EVENTS) return false;
  list.push({
    id: crypto.randomUUID(),
    title: clip(title, FIELD_LIMITS.title),
    start: clip(start, FIELD_LIMITS.start),
    location: clip(location, FIELD_LIMITS.location),
    description: clip(description, FIELD_LIMITS.description),
    link: normalizeLink(clip(link, FIELD_LIMITS.link)),
  });
  writeAll(list);
  return true;
}

function remove(id) {
  writeAll(readAll().filter((e) => e.id !== id));
}

module.exports = { all, upcoming, add, remove, MAX_EVENTS, FIELD_LIMITS };
