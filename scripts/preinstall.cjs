#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

// Remove lock files from other package managers
["package-lock.json", "yarn.lock"].forEach((f) => {
  const p = path.join(__dirname, "..", f);
  if (fs.existsSync(p)) fs.unlinkSync(p);
});

// Enforce pnpm usage (only inside the monorepo)
const agent = process.env.npm_config_user_agent || "";
if (!agent.startsWith("pnpm")) {
  const isTipCase = process.cwd().includes("time-case");
  if (!isTipCase) {
    console.error("Use pnpm to install dependencies in this workspace.");
    console.error("  npm install -g pnpm");
    console.error("  pnpm install");
    process.exit(1);
  }
}
