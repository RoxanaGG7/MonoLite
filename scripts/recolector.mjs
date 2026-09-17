import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const RAIZ = resolve(process.cwd(), "Docs-Internal", "packs", "urbanismo-granada");
const CACHE = resolve(RAIZ, "cache");
const ACTUALIZAR = process.argv.includes("--actualizar");

const SOURCES = [
  {
    slug: "titulo-setimo",
    url: "https://www.granada.org/inet/wpgo.nsf/xtod/8E5351BBD612227AC1256E27007BB09D?open",
    descripcion: "PGOU Granada 2001, Título Séptimo (Regulación de la Edificación)",
  },
  {
    slug: "titulo-setimo-continuacion",
    url: "https://www.granada.org/inet/wpgo.nsf/xtod/DB27E5B169F9AB98C1256E27007BAFDA?open",
    descripcion: "PGOU Granada 2001, Título Séptimo (Continuación: ordenanzas por calificación)",
  },
];

function normalizar(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hash(texto) {
  return createHash("sha256").update(texto).digest("hex");
}

async function recolectar(fuente) {
  const respuesta = await fetch(fuente.url, { headers: { "User-Agent": "MonoLite-Recolector/0.1" } });
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status} en ${fuente.url}`);
  const texto = normalizar(await respuesta.text());
  const h = hash(texto);

  const rutaTexto = resolve(CACHE, `${fuente.slug}.txt`);
  const rutaMeta = resolve(CACHE, `${fuente.slug}.meta.json`);
  const existeCache = existsSync(rutaTexto) && existsSync(rutaMeta);
  const metaPrev = existeCache ? JSON.parse(readFileSync(rutaMeta, "utf8")) : null;
  const textoPrev = existeCache ? readFileSync(rutaTexto, "utf8") : null;

  const pack = JSON.parse(readFileSync(resolve(RAIZ, "granada.json"), "utf8"));
  const articulos = pack.cobertura?.articulosMapeados ?? [];
  const clave = (a) => a.split(" (")[0].trim();
  const presentes = articulos.filter((a) => texto.includes(clave(a)));
  const presentesPrev = textoPrev ? articulos.filter((a) => textoPrev.includes(clave(a))) : null;

  let resultado;
  if (!existeCache) {
    resultado = {
      estado: "primera_captura",
      descripcion: fuente.descripcion,
      url: fuente.url,
      fecha: new Date().toISOString(),
      hash: h,
      articulosPresentes: presentes.length,
      articulosMapeados: articulos.length,
    };
  } else {
    const desaparecidos = presentesPrev ? presentesPrev.filter((a) => !presentes.includes(a)) : [];
    const nuevos = presentesPrev ? presentes.filter((a) => !presentesPrev.includes(a)) : [];
    resultado = {
      estado: h === metaPrev.hash ? "sin_cambios" : "CAMBIO_DETECTADO",
      descripcion: fuente.descripcion,
      url: fuente.url,
      fecha: new Date().toISOString(),
      hash: h,
      hashAnterior: metaPrev.hash,
      fechaAnterior: metaPrev.fecha,
      articulosPresentes: presentes.length,
      articulosMapeados: articulos.length,
      articulosDesaparecidos: desaparecidos,
      articulosNuevosEnFuente: nuevos,
      alerta: h !== metaPrev.hash ? "Re-visar la fuente: el texto cambió desde la última captura" : undefined,
      alertaCobertura: desaparecidos.length > 0 ? "Artículos mapeados han DESAPARECIDO de la fuente" : undefined,
    };
  }

  if (!existeCache || ACTUALIZAR) {
    writeFileSync(rutaTexto, texto, "utf8");
    writeFileSync(rutaMeta, JSON.stringify({ url: fuente.url, fecha: new Date().toISOString(), hash: h }, null, 2), "utf8");
  }

  return resultado;
}

mkdirSync(CACHE, { recursive: true });
const resultados = [];
for (const fuente of SOURCES) {
  try {
    resultados.push(await recolectar(fuente));
  } catch (error) {
    resultados.push({ estado: "ERROR", descripcion: fuente.descripcion, url: fuente.url, error: String(error) });
  }
}

const vigilancia = { fecha: new Date().toISOString(), modo: ACTUALIZAR ? "actualizar" : "verificacion", fuentes: resultados };
writeFileSync(resolve(RAIZ, "vigilancia.json"), JSON.stringify(vigilancia, null, 2) + "\n", "utf8");

for (const r of resultados) {
  console.log(`[${r.estado}] ${r.descripcion}`);
  if (r.estado === "CAMBIO_DETECTADO") console.log(`  ⚠ ${r.alerta}`);
  if (r.alertaCobertura) console.log(`  ⚠ ${r.alertaCobertura}: ${r.articulosDesaparecidos.join(", ")}`);
  if (r.estado === "primera_captura") console.log(`  Baseline: ${r.articulosPresentes}/${r.articulosMapeados} artículos mapeados presentes`);
}
