import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../public/teams");
mkdirSync(OUT_DIR, { recursive: true });

// Mapeo equipo → título exacto en Wikipedia
const WIKI_TITLES = {
  "Paris Saint-Germain": "Paris_Saint-Germain_FC",
  "Real Madrid":         "Real_Madrid_CF",
  "Manchester City":     "Manchester_City_F.C.",
  "Bayern München":      "FC_Bayern_Munich",
  "Liverpool":           "Liverpool_F.C.",
  "Inter":               "FC_Internazionale_Milano",
  "Chelsea":             "Chelsea_F.C.",
  "Borussia Dortmund":   "Borussia_Dortmund",
  "Barcelona":           "FC_Barcelona",
  "Arsenal":             "Arsenal_F.C.",
  "Bayer Leverkusen":    "Bayer_04_Leverkusen",
  "Atletico Madrid":     "Atletico_de_Madrid",
  "Benfica":             "S.L._Benfica",
  "Atalanta":            "Atalanta_B.C.",
  "Villarreal":          "Villarreal_CF",
  "Juventus":            "Juventus_F.C.",
  "Eintracht Frankfurt": "Eintracht_Frankfurt",
  "Club Brugge":         "Club_Brugge_KV",
  "Tottenham Hotspur":   "Tottenham_Hotspur_F.C.",
  "PSV Eindhoven":       "PSV_Eindhoven",
  "Ajax":                "AFC_Ajax",
  "Napoli":              "S.S.C._Napoli",
  "Sporting CP":         "Sporting_Clube_de_Portugal",
  "Olympiacos":          "Olympiacos_FC",
  "Slavia Praha":        "SK_Slavia_Prague",
  "Bodø/Glimt":          "FK_Bodo/Glimt",
  "Marseille":           "Olympique_de_Marseille",
  "FC Copenhagen":       "FC_Copenhagen",
  "AS Monaco":           "AS_Monaco_FC",
  "Galatasaray":         "Galatasaray_SK",
  "Union SG":            "Royale_Union_Saint-Gilloise",
  "Qarabağ":             "Qarabag_FK",
  "Athletic Club":       "Athletic_Bilbao",
  "Newcastle United":    "Newcastle_United_FC",
  "Pafos":               "Pafos_FC",
  "Kairat Almaty":       "FC_Kairat",
};

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function getLogoUrl(wikiTitle) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`;
  const res = await fetch(url, { headers: { "User-Agent": "UCLDrawApp/1.0" } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.thumbnail?.source ?? null;
}

async function downloadImage(url, filepath) {
  const res = await fetch(url, { headers: { "User-Agent": "UCLDrawApp/1.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = await res.arrayBuffer();
  writeFileSync(filepath, Buffer.from(buffer));
}

const mapping = {};

for (const [teamName, wikiTitle] of Object.entries(WIKI_TITLES)) {
  const s = slug(teamName);
  const filename = `${s}.png`;
  const filepath = join(OUT_DIR, filename);

  if (existsSync(filepath)) {
    mapping[teamName] = `/teams/${filename}`;
    console.log(`⏭️  Ya existe: ${teamName}`);
    continue;
  }

  const logoUrl = await getLogoUrl(wikiTitle);
  if (!logoUrl) {
    console.log(`❌ Sin thumbnail: ${teamName} (${wikiTitle})`);
    continue;
  }
  try {
    await downloadImage(logoUrl, filepath);
    mapping[teamName] = `/teams/${filename}`;
    console.log(`✅ ${teamName}`);
  } catch (e) {
    console.log(`❌ Error descargando ${teamName}: ${e.message}`);
  }
  await new Promise(r => setTimeout(r, 1500));
}

writeFileSync(join(__dirname, "../lib/team-logos.json"), JSON.stringify(mapping, null, 2));
console.log(`\n✅ ${Object.keys(mapping).length}/${Object.keys(WIKI_TITLES).length} logos descargados`);
console.log("✅ Mapping guardado en lib/team-logos.json");
