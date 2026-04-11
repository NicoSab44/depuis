/**
 * Production server for the Expo web export.
 * Serves dist/ as a static web app (SPA with index.html fallback).
 * Includes security headers and async streaming for performance.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DIST_ROOT = path.resolve(__dirname, "..", "dist");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".map": "application/json",
  ".webp": "image/webp",
};

const IMMUTABLE_EXTS = new Set([".js", ".mjs", ".css", ".woff", ".woff2", ".ttf", ".png", ".jpg", ".webp"]);

// Security headers applied to every response
const SECURITY_HEADERS = {
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "x-xss-protection": "1; mode=block",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "content-security-policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "img-src 'self' data: blob:",
    "connect-src 'self'",
  ].join("; "),
};

// File stat cache to avoid repeated disk lookups
const statCache = new Map();

function getStat(filePath) {
  if (statCache.has(filePath)) return statCache.get(filePath);
  try {
    const stat = fs.statSync(filePath);
    statCache.set(filePath, stat);
    return stat;
  } catch {
    statCache.set(filePath, null);
    return null;
  }
}

function serveFile(filePath, req, res) {
  const stat = getStat(filePath);
  if (!stat || !stat.isFile()) return false;

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || "application/octet-stream";
  const etag = `"${stat.size}-${stat.mtimeMs}"`;

  // ETag / conditional GET
  if (req.headers["if-none-match"] === etag) {
    res.writeHead(304, { ...SECURITY_HEADERS, etag });
    res.end();
    return true;
  }

  const headers = {
    ...SECURITY_HEADERS,
    "content-type": contentType,
    "content-length": stat.size,
    etag,
  };

  if (IMMUTABLE_EXTS.has(ext)) {
    headers["cache-control"] = "public, max-age=31536000, immutable";
  } else if (ext === ".html") {
    headers["cache-control"] = "no-cache";
  }

  res.writeHead(200, headers);

  if (req.method === "HEAD") {
    res.end();
    return true;
  }

  // Stream the file instead of readFileSync — avoids blocking the event loop
  fs.createReadStream(filePath).pipe(res);
  return true;
}

const server = http.createServer((req, res) => {
  // Only allow GET and HEAD
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { ...SECURITY_HEADERS, allow: "GET, HEAD" });
    res.end("Method Not Allowed");
    return;
  }

  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const pathname = url.pathname;

  const normalized = path.normalize(pathname);
  const filePath = path.join(DIST_ROOT, normalized);

  // Path traversal guard
  if (!filePath.startsWith(DIST_ROOT + path.sep) && filePath !== DIST_ROOT) {
    res.writeHead(403, SECURITY_HEADERS);
    res.end("Forbidden");
    return;
  }

  // 1. Try exact path
  if (serveFile(filePath, req, res)) return;

  // 2. Try index.html inside directory
  const stat = getStat(filePath);
  if (stat && stat.isDirectory()) {
    const indexPath = path.join(filePath, "index.html");
    if (serveFile(indexPath, req, res)) return;
  }

  // 3. SPA fallback → root index.html
  const rootIndex = path.join(DIST_ROOT, "index.html");
  if (serveFile(rootIndex, req, res)) return;

  res.writeHead(404, { ...SECURITY_HEADERS, "content-type": "text/plain" });
  res.end("Not Found");
});

const port = parseInt(process.env.PORT || "3000", 10);
server.listen(port, "0.0.0.0", () => {
  console.log(`Serving Depuis web app on port ${port}`);
});
