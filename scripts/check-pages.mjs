import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

const htmlFiles = readdirSync(root)
  .filter((name) => name.endsWith(".html"))
  .sort();

const requiredPages = [
  "1000.html",
  "403-block.html",
  "403-ip.html",
  "403-non-interactive.html",
  "403-under.html",
  "404.html",
  "429.html",
  "500.html",
  "index.html",
];

const requiredTokens = {
  "1000.html": ["::CLOUDFLARE_ERROR_1000S_BOX::"],
  "403-ip.html": ["::CLIENT_IP::", "::GEO::", "::RAY_ID::"],
  "403-non-interactive.html": ["::IM_UNDER_ATTACK_BOX::"],
  "403-under.html": ["::CAPTCHA_BOX::"],
  "429.html": ["::RAY_ID::"],
  "500.html": ["::CLOUDFLARE_ERROR_500S_BOX::"],
};

const failures = [];

for (const page of requiredPages) {
  if (!htmlFiles.includes(page)) {
    failures.push(`${page}: missing required page`);
  }
}

for (const file of htmlFiles) {
  const content = readFileSync(join(root, file), "utf8");

  assertIncludes(file, content, "<!doctype html>");
  assertIncludes(file, content, '<meta name="viewport" content="width=device-width, initial-scale=1">');
  assertIncludes(file, content, '<meta name="robots" content="noindex">');
  assertIncludes(file, content, '<main class="page">');

  if (content.includes("http-equiv=\"refresh\"")) {
    failures.push(`${file}: must not depend on meta refresh redirects`);
  }

  if (content.match(/https?:\/\//)) {
    failures.push(`${file}: must not reference remote assets or URLs`);
  }

  for (const token of requiredTokens[file] ?? []) {
    assertIncludes(file, content, token);
  }
}

const css = readFileSync(join(root, "assets/error.css"), "utf8");
for (const forbidden of ["outline: 0", "height: 100vh", "overflow: hidden", "user-select: none"]) {
  if (css.includes(forbidden)) {
    failures.push(`assets/error.css: forbidden pattern "${forbidden}"`);
  }
}

for (const asset of ["assets/error.css"]) {
  const size = statSync(join(root, asset)).size;
  if (size === 0) {
    failures.push(`${asset}: empty asset`);
  }
}

for (const file of htmlFiles) {
  const size = statSync(join(root, file)).size;
  if (size > 20_000) {
    failures.push(`${file}: unexpectedly large (${size} bytes)`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Checked ${htmlFiles.length} HTML pages and shared assets.`);

function assertIncludes(file, content, expected) {
  if (!content.includes(expected)) {
    failures.push(`${file}: missing ${expected}`);
  }
}
