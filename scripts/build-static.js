const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const sourceHtml = path.join(root, "landing-page.html");
const sourceAssets = path.join(root, "assets");

function copyDirectory(source, destination) {
  fs.mkdirSync(destination, { recursive: true });

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
      continue;
    }

    if (entry.isFile()) {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  }
}

if (!fs.existsSync(sourceHtml)) {
  throw new Error("landing-page.html nao encontrado.");
}

if (!fs.existsSync(sourceAssets)) {
  throw new Error("Pasta assets nao encontrada.");
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

fs.copyFileSync(sourceHtml, path.join(dist, "index.html"));
copyDirectory(sourceAssets, path.join(dist, "assets"));
fs.writeFileSync(path.join(dist, ".nojekyll"), "");

console.log("Build estatico concluido em dist/.");
