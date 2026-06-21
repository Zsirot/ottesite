// Fetches the latest post title from John's Substack RSS feed and caches it.
// Refreshes in the background (never blocks a page request) and keeps the last
// good value if a fetch fails, so the home page degrades gracefully.

const FEED_URL = process.env.SUBSTACK_FEED_URL || "https://johnotte.substack.com/feed";
const TTL_MS = 30 * 60 * 1000; // refresh at most ~twice an hour

let cache = { title: null, fetchedAt: 0 };
let inFlight = false;

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

function parseLatestTitle(xml) {
  // Title of the first <item> (skip the channel <title>); handle CDATA.
  const item = xml.match(/<item[\s\S]*?<\/item>/i);
  const scope = item ? item[0] : xml;
  const m = scope.match(/<title>([\s\S]*?)<\/title>/i);
  if (!m) return null;
  let t = m[1].trim();
  const cdata = t.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  t = cdata ? cdata[1].trim() : decodeEntities(t);
  return t || null;
}

async function refresh() {
  if (inFlight) return;
  inFlight = true;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(FEED_URL, {
      signal: ctrl.signal,
      headers: { "User-Agent": "OtteSite/1.0 (+https://johnaotte.com)" },
    });
    clearTimeout(timer);
    if (!res.ok) return;
    const title = parseLatestTitle(await res.text());
    if (title) cache = { title, fetchedAt: Date.now() };
  } catch (e) {
    // keep the previous cached value on any failure
  } finally {
    inFlight = false;
  }
}

// Returns the cached title (or null). Kicks off a background refresh when stale.
function getLatestTitle() {
  if (Date.now() - cache.fetchedAt > TTL_MS) refresh();
  return cache.title;
}

// Warm the cache shortly after startup.
refresh();

module.exports = { getLatestTitle };
