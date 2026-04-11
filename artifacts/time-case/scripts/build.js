const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const projectRoot = path.resolve(__dirname, "..");

function run(cmd, opts = {}) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { cwd: projectRoot, stdio: "inherit", ...opts });
}

async function main() {
  console.log("Building Expo web export...");

  const distDir = path.join(projectRoot, "dist");
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
    console.log("Cleaned dist/");
  }

  run("pnpm exec expo export --platform web --output-dir dist");

  console.log("Web build complete → dist/");
}

main().catch((err) => {
  console.error("Build failed:", err.message);
  process.exit(1);
});
