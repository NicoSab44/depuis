const { execSync } = require("child_process");
const path = require("path");

const BASE_VERSION = "1.0.0";

function getCommitCount() {
  try {
    const count = execSync("git rev-list --count HEAD", {
      cwd: path.resolve(__dirname),
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
    return parseInt(count, 10) || 0;
  } catch {
    return 0;
  }
}

const commitCount = getCommitCount();
const version = `${BASE_VERSION}.${commitCount}`;

const base = require("./app.json");

console.log(`[app.config] version → ${version}`);

module.exports = {
  ...base,
  expo: {
    ...base.expo,
    version,
    android: {
      ...base.expo.android,
      versionCode: commitCount,
    },
  },
};
