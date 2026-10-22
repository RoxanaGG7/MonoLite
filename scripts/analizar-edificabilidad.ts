import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { areaPoligono, poligonoOffsetInterior } from "../src/core/geometry.js";
import type { Punto } from "../src/core/kernel.js";

const ruta = process.argv[2] ?? resolve(process.cwd(), "tests", "fixtures", "parcela-real.json");
const args = process.argv.slice(3);
const iRetranqueos = args.indexOf("--retranqueos");
const niveles = iRetranqueos !== -1 ? args[iRetranqueos + 1].split(",").map(Number) : [0.5, 3, 6];

const kernel = JSON.parse(readFileSync(ruta, "utf8")) as {
  refCatastral: string;
  areaCatastral: number;
  parcela: { contorno: Punto[] };
};

const envolventes = niveles
  .map((retranqueo) => {
    const inset = poligonoOffsetInterior(kernel.parcela.contorno, retranqueo);
    return {
      retranqueo,
      verticesEnvolvente: inset.length,
      areaEnvolvente: inset.length >= 3 ? Number(areaPoligono(inset).toFixed(1)) : 0,
    };
  })
  .filter((e) => e.retranqueo > 0);

const urbanizable = envolventes.some((e) => e.areaEnvolvente > 0);

kernel.analisisUrbanizable = {
  fecha: new Date().toISOString().slice(0, 10),
  envolventes,
  urbanizable,
};

writeFileSync(ruta, JSON.stringify(kernel, null, 2) + "\n", "utf8");
const resumen = envolventes.map((e) => `${e.retranqueo} m → ${e.areaEnvolvente} m²`).join(" | ");
console.log(
  urbanizable
    ? `Parcela ${kernel.refCatastral}: URBANIZABLE — envolventes: ${resumen}`
    : `Parcela ${kernel.refCatastral}: SIN envolvente en ningún nivel (${resumen})`
);
