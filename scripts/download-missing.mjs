import { writeFileSync, existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../public/teams");

// Títulos de Wikipedia para los que faltan
const MISSING = {
  "Napoli":          "S.S.C._Napoli",
  "Sporting CP":     "Sporting_CP",
  "Olympiacos":      "Olympiacos_FC",
  "Slavia Praha":    "SK_Slavia_Prague",
  "Bodø/Glimt":      "FK_Bodø/Glimt",
  "FC Copenhagen":   "FC_Copenhagen",
  "Galatasaray":     "Galatasaray_S.K.",
  "Union SG":        "Royale_Union_Saint-Gilloise",
  "Qarabağ":         "Qarabağ_FK",
  "Athletic Club":   "Athletic_Bilbao",
  "Newcastle United":"Newcastle_United_F.C.",
  "Pafos":           "Pafos_FC",
};

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function getImageUrl(wikiTitle) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`;
  const res = await fetch(url, { headers: { "User-Agent": "UCLDrawApp/1.0 (educational project)" } });
  if (!res.ok) return null;
  const data = await res.json();
  // thumbnail primero, después originalimage — ambos vienen de Wikimedia Commons
  return data.thumbnail?.source ?? data.originalimage?.source ?? null;
}

async function downloadImage(url, filepath) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; UCLDrawApp)" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = await res.arrayBuffer();
  writeFileSync(filepath, Buffer.from(buffer));
}

const mappingPath = join(__dirname, "../lib/team-logos.json");
const mapping = JSON.parse(readFileSync(mappingPath, "utf8"));

for (const [teamName, wikiTitle] of Object.entries(MISSING)) {
  const filename = `${slug(teamName)}.png`;
  const filepath = join(OUT_DIR, filename);

  if (existsSync(filepath)) {
    mapping[teamName] = `/teams/${filename}`;
    console.log(`⏭️  Ya existe: ${teamName}`);
    continue;
  }

  const logoUrl = await getImageUrl(wikiTitle);
  if (!logoUrl) {
    console.log(`❌ Sin imagen: ${teamName}`);
    continue;
  }

  try {
    await downloadImage(logoUrl, filepath);
    mapping[teamName] = `/teams/${filename}`;
    console.log(`✅ ${teamName}`);
  } catch (e) {
    console.log(`❌ ${teamName}: ${e.message}`);
  }
  await new Promise(r => setTimeout(r, 800));
}

writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
console.log(`\n✅ ${Object.keys(mapping).length}/36 logos en total`);
