import { describe, expect, it } from "vitest";
import { evaluatePack, evaluateRule } from "../src/engine/evaluator.js";
import type { Rule, ComputationRule } from "../src/engine/rule.js";
import { applyComputations } from "../src/engine/computation.js";
import { generarInforme } from "../src/engine/informe.js";
import { loadPack } from "../src/engine/loader.js";
import { deriveEdificio, derivePatio, type KernelModel, type Lindero, type Punto } from "../src/core/kernel.js";
import { buildModel } from "../src/core/derive.js";
import {
  areaPoligono,
  distanciaMinimaLinderos,
  distanciaPuntoSegmento,
} from "../src/core/geometry.js";
import { getCapabilities } from "../src/ai/capabilities.js";
import { resolve } from "node:path";
import { existsSync } from "node:fs";

const patioRule: Rule = {
  id: "TEST-URB-05",
  version: "0.1.0",
  jurisdiction: "test",
  source: { document: "Doc de prueba", article: "1.2.3" },
  conditions: {
    mode: "any",
    items: [
      { parameter: "patio.anchoMinimo", operator: "<", value: 3 },
      {
        parameter: "patio.anchoMinimo",
        operator: "<",
        value: { param: "patio.diametroMinimoRequerido" },
      },
      { parameter: "patio.superficieUtil", operator: "<", value: 9 },
    ],
  },
  severity: "bloqueo",
  message: "Patio no cumple dimensiones mínimas.",
};

function modelWithPatio(ancho: number, largo: number, superficie: number, altura: number) {
  const patio = derivePatio({ anchoMinimo: ancho, largoMinimo: largo, superficieUtil: superficie, alturaVinculada: altura });
  return { patio };
}

describe("motor de reglas (L0 — determinista)", () => {
  it("bloquea un patio con lado menor al mínimo legal", () => {
    const violation = evaluateRule(patioRule, modelWithPatio(2.4, 5, 12, 9));
    expect(violation).not.toBeNull();
    expect(violation?.severity).toBe("bloqueo");
    expect(violation?.source.article).toBe("1.2.3");
  });

  it("bloquea un patio de 3,2 m cuando la altura exige círculo mayor (H/3)", () => {
    const violation = evaluateRule(patioRule, modelWithPatio(3.2, 5, 12, 21));
    expect(violation).not.toBeNull();
    expect((violation?.failed[0] as { parameter: string }).parameter).toBe("patio.anchoMinimo");
  });

  it("pasa un patio que cumple lado, círculo y superficie", () => {
    expect(evaluateRule(patioRule, modelWithPatio(3.6, 5, 11, 10.8))).toBeNull();
  });

  it("un pack sin violaciones devuelve informe verde", () => {
    expect(evaluatePack([patioRule], modelWithPatio(3.6, 5, 11, 10.8))).toHaveLength(0);
  });

  it("parámetro ausente no viola (regla no aplicable)", () => {
    expect(evaluateRule(patioRule, { patio: { superficieUtil: 10 } as never })).toBeNull();
  });

  it("regla all-mode: altura RUAIS de 2 plantas se bloquea solo al superar 7,90 m", () => {
    const alturaRule: Rule = {
      id: "GR-RUAIS-01B",
      version: "0.1.0",
      jurisdiction: "Granada",
      source: { document: "PGOU 2001", article: "7.11.6.2.b" },
      conditions: {
        mode: "all",
        items: [
          { parameter: "edificio.numeroPlantas", operator: "==", value: 2 },
          { parameter: "edificio.alturaMaxima", operator: ">", value: 7.9 },
        ],
      },
      severity: "bloqueo",
      message: "Altura máxima 2 plantas RUAIS: 7,90 m.",
    };
    expect(evaluateRule(alturaRule, { edificio: { numeroPlantas: 2, alturaMaxima: 8.2 } })).not.toBeNull();
    expect(evaluateRule(alturaRule, { edificio: { numeroPlantas: 2, alturaMaxima: 7.5 } })).toBeNull();
    expect(evaluateRule(alturaRule, { edificio: { numeroPlantas: 1, alturaMaxima: 8.2 } })).toBeNull();
  });

  it("condición de ratio: ocupación RUAIS 30% se bloquea al superarla", () => {
    const ocupacionRule: Rule = {
      id: "GR-RUAIS-03",
      version: "0.1.0",
      jurisdiction: "Granada",
      source: { document: "PGOU 2001", article: "7.11.4.1" },
      conditions: {
        mode: "all",
        items: [
          {
            numerator: "edificio.superficieOcupadaProyectada",
            denominator: "parcela.superficie",
            operator: ">",
            value: 0.3,
          },
        ],
      },
      severity: "bloqueo",
      message: "Ocupación máxima RUAIS: 30%.",
    };
    const model = (ocupada: number) => ({
      edificio: { superficieOcupadaProyectada: ocupada },
      parcela: { superficie: 400 },
    });
    expect(evaluateRule(ocupacionRule, model(130))).not.toBeNull();
    expect(evaluateRule(ocupacionRule, model(110))).toBeNull();
  });

  it("edificabilidad RUAIS por plantas: 0,60 con 2 plantas, pero válida con 3", () => {
    const edifRule: Rule = {
      id: "GR-RUAIS-04B",
      version: "0.1.0",
      jurisdiction: "Granada",
      source: { document: "PGOU 2001", article: "7.11.8.1.b" },
      conditions: {
        mode: "all",
        items: [
          { parameter: "edificio.numeroPlantas", operator: "==", value: 2 },
          {
            numerator: "edificio.superficieEdificadaTotal",
            denominator: "parcela.superficie",
            operator: ">",
            value: 0.6,
          },
        ],
      },
      severity: "bloqueo",
      message: "Edificabilidad máxima RUAIS 2 plantas: 0,60.",
    };
    const model = (plantas: number) => ({
      edificio: { numeroPlantas: plantas, superficieEdificadaTotal: 800 },
      parcela: { superficie: 1200 },
    });
    expect(evaluateRule(edifRule, model(2))).not.toBeNull();
    expect(evaluateRule(edifRule, model(3))).toBeNull();
  });

  it("ratio con denominador cero no viola (regla no evaluable)", () => {
    const rule: Rule = {
      id: "RATIO-0",
      version: "0.1.0",
      jurisdiction: "test",
      source: { document: "t", article: "t" },
      conditions: {
        mode: "all",
        items: [
          { numerator: "a.x", denominator: "b.y", operator: ">", value: 0.1 },
        ],
      },
      severity: "bloqueo",
      message: "ratio",
    };
    expect(evaluateRule(rule, { a: { x: 1 }, b: { y: 0 } })).toBeNull();
  });

  it("umbral paramétrico con factor: separación RPBA ≥ altura/2 (art. 7.13.3)", () => {
    const rule: Rule = {
      id: "GR-RPBA-09",
      version: "0.1.0",
      jurisdiction: "Granada",
      source: { document: "PGOU 2001", article: "7.13.3" },
      conditions: {
        mode: "any",
        items: [
          {
            parameter: "edificio.distanciaMinimaLinderos",
            operator: "<",
            value: { param: "edificio.alturaMaxima", factor: 0.5 },
          },
          { parameter: "edificio.distanciaMinimaLinderos", operator: "<=", value: 3 },
        ],
      },
      severity: "bloqueo",
      message: "Separación RPBA: ≥ altura/2 y >3 m.",
    };
    const alto = { edificio: { distanciaMinimaLinderos: 4, alturaMaxima: 21.1 } };
    const bajo = { edificio: { distanciaMinimaLinderos: 4, alturaMaxima: 7.9 } };
    expect(evaluateRule(rule, alto)).not.toBeNull();
    expect(evaluateRule(rule, bajo)).toBeNull();
    expect(evaluateRule(rule, { edificio: { distanciaMinimaLinderos: 2.9, alturaMaxima: 4.6 } })).not.toBeNull();
  });

  it("cubierta sobre altura máxima con pendiente ≥ 40% está prohibida (art. 7.3.17)", () => {
    const rule: Rule = {
      id: "GR-URB-06E",
      version: "0.1.0",
      jurisdiction: "Granada",
      source: { document: "PGOU 2001", article: "7.3.17" },
      conditions: {
        mode: "all",
        items: [
          { parameter: "edificio.cubiertaSobreAlturaMaxima", operator: "==", value: 1 },
          { parameter: "edificio.pendienteCubierta", operator: ">=", value: 40 },
        ],
      },
      severity: "bloqueo",
      message: "Cubierta sobre altura máx. solo con pendiente <40%.",
    };
    expect(evaluateRule(rule, { edificio: { cubiertaSobreAlturaMaxima: 1, pendienteCubierta: 55 } })).not.toBeNull();
    expect(evaluateRule(rule, { edificio: { cubiertaSobreAlturaMaxima: 1, pendienteCubierta: 30 } })).toBeNull();
  });
});

describe("geometría del núcleo (distancias a linderos)", () => {
  const linderos: Lindero[] = [
    { tipo: "frontal", a: { x: 0, y: 0 }, b: { x: 20, y: 0 } },
    { tipo: "lateral", a: { x: 0, y: 0 }, b: { x: 0, y: 15 } },
    { tipo: "testero", a: { x: 20, y: 15 }, b: { x: 0, y: 15 } },
  ];
  const huella = (margen: number): Punto[] => [
    { x: margen, y: margen },
    { x: 20 - margen, y: margen },
    { x: 20 - margen, y: 15 - margen },
    { x: margen, y: 15 - margen },
  ];
  const retranqueoRule: Rule = {
    id: "GR-RUAIS-02",
    version: "0.1.0",
    jurisdiction: "Granada",
    source: { document: "PGOU 2001", article: "7.11.3" },
    conditions: {
      mode: "any",
      items: [{ parameter: "edificio.distanciaMinimaLinderos", operator: "<", value: 3 }],
    },
    severity: "bloqueo",
    message: "Retranqueo mínimo RUAIS: 3,00 m a todos los linderos.",
  };

  it("distancia perpendicular punto-segmento es exacta", () => {
    expect(distanciaPuntoSegmento({ x: 5, y: 3 }, { x: 0, y: 0 }, { x: 10, y: 0 })).toBe(3);
  });

  it("la distancia se clampea al extremo del segmento", () => {
    expect(distanciaPuntoSegmento({ x: 15, y: 4 }, { x: 0, y: 0 }, { x: 10, y: 0 })).toBeCloseTo(Math.hypot(5, 4), 10);
  });

  it("huella a 2,5 m del lindero: violación del retranqueo RUAIS", () => {
    const distancia = distanciaMinimaLinderos(huella(2.5), linderos);
    expect(distancia).toBe(2.5);
    const violation = evaluateRule(retranqueoRule, {
      edificio: { distanciaMinimaLinderos: distancia! },
    });
    expect(violation?.ruleId).toBe("GR-RUAIS-02");
  });

  it("huella a 3,5 m de todos los linderos: conforme", () => {
    const distancia = distanciaMinimaLinderos(huella(3.5), linderos);
    expect(evaluateRule(retranqueoRule, {
      edificio: { distanciaMinimaLinderos: distancia! },
    })).toBeNull();
  });

  it("área del polígono (fórmula del shoelace)", () => {
    expect(areaPoligono(huella(2.5))).toBe(15 * 10);
  });

  it("sin huella suficiente no evalúa (regla no aplicable)", () => {
    expect(distanciaMinimaLinderos([{ x: 0, y: 0 }], linderos)).toBeUndefined();
  });

  it("coordenadas reales (EPSG:25830, UTM 30N): distancias exactas a escala de catastro", () => {
    const utmLinderos: Lindero[] = [
      {
        tipo: "frontal",
        a: { x: 455000, y: 4130000 },
        b: { x: 455020, y: 4130000 },
      },
      {
        tipo: "lateral",
        a: { x: 455000, y: 4130000 },
        b: { x: 455000, y: 4130015 },
      },
    ];
    const huellaUTM: Punto[] = [
      { x: 455002.5, y: 4130002.5 },
      { x: 455017.5, y: 4130002.5 },
      { x: 455017.5, y: 4130012.5 },
      { x: 455002.5, y: 4130012.5 },
    ];
    expect(distanciaMinimaLinderos(huellaUTM, utmLinderos)).toBe(2.5);
  });
});

describe("reglas generales v0.2 (GR-URB-06 a 10)", () => {
  it("cumbrera derivada: altura máxima 7,90 m permite cumbrera hasta 9,90 m", () => {
    const edificio = deriveEdificio({ alturaMaxima: 7.9 } as never);
    expect(edificio.cumbreraMaxima).toBe(9.9);
    const rule: Rule = {
      id: "GR-URB-06A",
      version: "0.1.0",
      jurisdiction: "Granada",
      source: { document: "PGOU 2001", article: "7.3.17" },
      conditions: {
        mode: "any",
        items: [
          {
            parameter: "edificio.alturaCumbrera",
            operator: ">",
            value: { param: "edificio.cumbreraMaxima" },
          },
        ],
      },
      severity: "bloqueo",
      message: "Cumbrera máx +2 m sobre última planta.",
    };
    const model = { edificio: deriveEdificio({ alturaMaxima: 7.9, alturaCumbrera: 10.2 } as never) };
    expect(evaluateRule(rule, model)).not.toBeNull();
    const ok = { edificio: deriveEdificio({ alturaMaxima: 7.9, alturaCumbrera: 9.5 } as never) };
    expect(evaluateRule(rule, ok)).toBeNull();
  });

  it("prohibición expresa: depósito de agua sobre altura máxima (art. 7.3.17)", () => {
    const rule: Rule = {
      id: "GR-URB-06D",
      version: "0.1.0",
      jurisdiction: "Granada",
      source: { document: "PGOU 2001", article: "7.3.17" },
      conditions: {
        mode: "any",
        items: [
          { parameter: "edificio.depositoAguaSobreAlturaMaxima", operator: "==", value: 1 },
        ],
      },
      severity: "bloqueo",
      message: "Prohibido depósito de agua sobre altura máxima.",
    };
    expect(evaluateRule(rule, { edificio: { depositoAguaSobreAlturaMaxima: 1 } })).not.toBeNull();
    expect(evaluateRule(rule, { edificio: { depositoAguaSobreAlturaMaxima: 0 } })).toBeNull();
  });

  it("patio de ventilación usa H/5 y mínimos de 2 m / 4 m² (art. 7.3.23.1)", () => {
    const patioVentilacion = derivePatio({
      tipo: "ventilacion",
      anchoMinimo: 2.2,
      largoMinimo: 3,
      superficieUtil: 5,
      alturaVinculada: 15,
    });
    expect(patioVentilacion.diametroMinimoRequerido).toBe(3);
    const rule: Rule = {
      id: "GR-URB-10",
      version: "0.1.0",
      jurisdiction: "Granada",
      source: { document: "PGOU 2001", article: "7.3.23.1" },
      conditions: {
        mode: "any",
        items: [
          { parameter: "patioVentilacion.anchoMinimo", operator: "<", value: 2 },
          {
            parameter: "patioVentilacion.anchoMinimo",
            operator: "<",
            value: { param: "patioVentilacion.diametroMinimoRequerido" },
          },
          { parameter: "patioVentilacion.superficieUtil", operator: "<", value: 4 },
        ],
      },
      severity: "bloqueo",
      message: "Patio de ventilación insuficiente.",
    };
    expect(evaluateRule(rule, { patioVentilacion })).not.toBeNull();
  });

  it("iluminación de pieza habitable: ratio 1/10 de superficie útil (art. 7.4.6.1)", () => {
    const rule: Rule = {
      id: "GR-URB-09A",
      version: "0.1.0",
      jurisdiction: "Granada",
      source: { document: "PGOU 2001", article: "7.4.6.1" },
      conditions: {
        mode: "any",
        items: [
          {
            numerator: "espacio.superficieHuecosIluminacion",
            denominator: "espacio.superficie",
            operator: "<",
            value: 0.1,
          },
        ],
      },
      severity: "bloqueo",
      message: "Huecos de iluminación insuficientes.",
    };
    const oscuro = { espacio: { superficie: 20, superficieHuecosIluminacion: 1.5 } };
    const iluminado = { espacio: { superficie: 20, superficieHuecosIluminacion: 2.2 } };
    expect(evaluateRule(rule, oscuro)).not.toBeNull();
    expect(evaluateRule(rule, iluminado)).toBeNull();
  });
});

describe("reglas generales v0.3: sótanos y entreplantas", () => {
  const rule = (id: string, article: string, items: Rule["conditions"]["items"], mode: "all" | "any" = "any"): Rule => ({
    id,
    version: "0.1.0",
    jurisdiction: "Granada",
    source: { document: "PGOU 2001", article },
    conditions: { mode, items },
    severity: "bloqueo",
    message: id,
  });

  it("semisótano: forjado de techo máximo a +1,30 m de la cota de referencia (art. 7.3.18.b)", () => {
    const r = rule("GR-URB-07C", "7.3.18.b", [
      { parameter: "edificio.cotaForjadoSemisotanoSobreReferencia", operator: ">", value: 1.3 },
    ]);
    expect(evaluateRule(r, { edificio: { cotaForjadoSemisotanoSobreReferencia: 1.45 } })).not.toBeNull();
    expect(evaluateRule(r, { edificio: { cotaForjadoSemisotanoSobreReferencia: 1.2 } })).toBeNull();
  });

  it("número de sótanos no puede exceder de cuatro (art. 7.3.19.2)", () => {
    const r = rule("GR-URB-08C", "7.3.19.2", [
      { parameter: "edificio.numeroSotanos", operator: ">", value: 4 },
    ]);
    expect(evaluateRule(r, { edificio: { numeroSotanos: 5 } })).not.toBeNull();
    expect(evaluateRule(r, { edificio: { numeroSotanos: 4 } })).toBeNull();
  });

  it("entreplanta: máximo 50% de la planta baja y retranqueada 3 m de fachada (art. 7.3.19.3)", () => {
    const superficie = rule("GR-URB-08D", "7.3.19.3", [
      { numerator: "edificio.superficieEntreplanta", denominator: "edificio.superficiePlantaBaja", operator: ">", value: 0.5 },
    ], "all");
    const retranqueo = rule("GR-URB-08E", "7.3.19.3", [
      { parameter: "edificio.separacionEntreplantaFachada", operator: "<", value: 3 },
    ]);
    const excesiva = { edificio: { superficieEntreplanta: 60, superficiePlantaBaja: 100 } };
    const conforme = { edificio: { superficieEntreplanta: 45, superficiePlantaBaja: 100, separacionEntreplantaFachada: 3.5 } };
    expect(evaluateRule(superficie, excesiva)).not.toBeNull();
    expect(evaluateRule(superficie, conforme)).toBeNull();
    expect(evaluateRule(retranqueo, { edificio: { separacionEntreplantaFachada: 2 } })).not.toBeNull();
    expect(evaluateRule(retranqueo, conforme)).toBeNull();
  });
});

describe("regla de cómputo (art. 7.3.13): el takeoff nace normado", () => {
  const computo: ComputationRule = {
    id: "GR-URB-COMPUTO-01",
    version: "0.1.0",
    jurisdiction: "Granada",
    source: { document: "PGOU 2001", article: "7.3.13" },
    target: "edificio.superficieEdificadaTotal",
    formula: [
      { param: "edificio.superficiePlantasSobreRasante", coef: 1 },
      { param: "edificio.superficieCuerposSalientesCubiertosCerrados", coef: 1 },
      { param: "edificio.superficieCuerposSalientesCubiertosAbiertos", coef: 0.5 },
      { param: "edificio.superficieCuartosServicio", coef: 1 },
    ],
  };

  const modeloComponentes = (plantas: number, cerrados: number, abiertos: number, servicios: number) => ({
    edificio: {
      numeroPlantas: 2,
      superficiePlantasSobreRasante: plantas,
      superficieCuerposSalientesCubiertosCerrados: cerrados,
      superficieCuerposSalientesCubiertosAbiertos: abiertos,
      superficieCuartosServicio: servicios,
      superficieEdificadaTotal: 999,
    },
    parcela: { superficie: 500 },
  });

  it("computa la superficie edificada: plantas + cerrados + 50% abiertos + servicios", () => {
    const model = applyComputations([computo], modeloComponentes(235, 10, 20, 5) as never);
    expect((model.edificio as Record<string, number>).superficieEdificadaTotal).toBe(235 + 10 + 10 + 5);
  });

  it("el valor computado reemplaza el manual y alimenta la regla de edificabilidad", () => {
    const edifRule: Rule = {
      id: "GR-RUAIS-04B",
      version: "0.1.0",
      jurisdiction: "Granada",
      source: { document: "PGOU 2001", article: "7.11.8.1.b" },
      conditions: {
        mode: "all",
        items: [
          { parameter: "edificio.numeroPlantas", operator: "==", value: 2 },
          {
            numerator: "edificio.superficieEdificadaTotal",
            denominator: "parcela.superficie",
            operator: ">",
            value: 0.6,
          },
        ],
      },
      severity: "bloqueo",
      message: "Edificabilidad máxima RUAIS 2 plantas: 0,60.",
    };
    const model = applyComputations([computo], modeloComponentes(235, 10, 20, 5) as never);
    expect(evaluateRule(edifRule, model)).toBeNull();
    const excesivo = applyComputations([computo], modeloComponentes(320, 10, 20, 5) as never);
    expect(evaluateRule(edifRule, excesivo)).not.toBeNull();
  });

  it("sin componentes no computa (el valor manual se respeta)", () => {
    const model = applyComputations([computo], { edificio: { superficieEdificadaTotal: 300 } });
    expect((model.edificio as Record<string, number>).superficieEdificadaTotal).toBe(300);
  });
});

describe("informe con declaración de cobertura (anti-obsolescencia)", () => {
  const rule: Rule = {
    id: "TEST-01",
    version: "0.1.0",
    jurisdiction: "test",
    source: { document: "Norma A", article: "1.1" },
    conditions: { mode: "any", items: [{ parameter: "a.b", operator: ">", value: 1 }] },
    severity: "bloqueo",
    message: "test",
  };

  it("informe verde declara qué evalúa y qué no", () => {
    const informe = generarInforme([rule], [], {
      noCubre: ["Normativa sectorial", "Catálogos de protección"],
    });
    expect(informe.estado).toBe("verde");
    expect(informe.cobertura.evalua).toEqual(["Norma A"]);
    expect(informe.cobertura.articulos).toEqual(["1.1"]);
    expect(informe.cobertura.noCubre).toHaveLength(2);
  });

  it("estado rojo con bloqueo, ámbar con solo avisos", () => {
    const violation = evaluateRule(rule, { a: { b: 2 } })!;
    const ambarRule: Rule = { ...rule, id: "TEST-02", severity: "ambar" };
    const ambarViolation = evaluateRule(ambarRule, { a: { b: 2 } })!;
    expect(generarInforme([rule], [violation]).estado).toBe("rojo");
    expect(generarInforme([ambarRule], [ambarViolation]).estado).toBe("ambar");
    expect(generarInforme([rule], []).estado).toBe("verde");
  });

  it.skipIf(!existsSync(resolve("Docs-Internal", "packs", "urbanismo-granada", "granada.json")))(
    "el pack real de Granada declara 57 artículos y 4 exclusiones",
    () => {
      const pack = loadPack(resolve("Docs-Internal", "packs", "urbanismo-granada", "granada.json"));
      expect(pack.cobertura?.articulosMapeados.length).toBeGreaterThan(50);
      expect(pack.noCubre?.length).toBe(4);
      expect(pack.estado).toBe("vigente");
      const informe = generarInforme(pack.rules, [], pack);
      expect(informe.cobertura.articulos.length).toBeGreaterThan(50);
    }
  );
});

describe("constructor de modelos (geometría → parámetros derivados)", () => {
  const kernel: KernelModel = {
    parcela: {
      id: "p1",
      type: "parcela",
      crs: "EPSG:25830",
      superficie: 0,
      contorno: [
        { x: 0, y: 0 },
        { x: 20, y: 0 },
        { x: 20, y: 15 },
        { x: 0, y: 15 },
      ],
      linderos: [
        { tipo: "frontal", a: { x: 0, y: 0 }, b: { x: 20, y: 0 } },
        { tipo: "lateral", a: { x: 0, y: 0 }, b: { x: 0, y: 15 } },
        { tipo: "testero", a: { x: 20, y: 15 }, b: { x: 0, y: 15 } },
      ],
      cotaReferencia: 0,
      calificacion: "RUAIS",
    },
    edificio: {
      alturaMaxima: 7.9,
      numeroPlantas: 2,
      superficieEdificadaTotal: 300,
      superficieOcupadaProyectada: 0,
      huella: [
        { x: 2.5, y: 2.5 },
        { x: 17.5, y: 2.5 },
        { x: 17.5, y: 12.5 },
        { x: 2.5, y: 12.5 },
      ],
    },
    entities: [],
  };

  it("calcula superficie de parcela y ocupación desde la geometría real", () => {
    const model = buildModel(kernel);
    expect((model.parcela as { superficie: number }).superficie).toBe(300);
    const edificio = model.edificio as Record<string, number>;
    expect(edificio.superficieOcupadaProyectada).toBe(150);
    expect(edificio.distanciaMinimaLinderos).toBe(2.5);
  });

  it("deriva la longitud del lindero frontal desde la geometría", () => {
    const model = buildModel(kernel);
    expect((model.parcela as { longitudLinderoFrontal: number }).longitudLinderoFrontal).toBe(20);
  });

  it("deriva la fachada máxima de la huella (frentes de manzana)", () => {
    const model = buildModel(kernel);
    expect((model.edificio as Record<string, number>).longitudMaximaFachada).toBe(15);
  });

  it("el modelo derivado dispara las reglas RUAIS reales de retranqueo y edificabilidad", () => {
    const model = buildModel(kernel);
    const retranqueo: Rule = {
      id: "GR-RUAIS-02",
      version: "0.1.0",
      jurisdiction: "Granada",
      source: { document: "PGOU 2001", article: "7.11.3" },
      conditions: {
        mode: "any",
        items: [{ parameter: "edificio.distanciaMinimaLinderos", operator: "<", value: 3 }],
      },
      severity: "bloqueo",
      message: "Retranqueo mínimo RUAIS: 3,00 m.",
    };
    const edificabilidad: Rule = {
      id: "GR-RUAIS-04B",
      version: "0.1.0",
      jurisdiction: "Granada",
      source: { document: "PGOU 2001", article: "7.11.8.1.b" },
      conditions: {
        mode: "all",
        items: [
          { parameter: "edificio.numeroPlantas", operator: "==", value: 2 },
          {
            numerator: "edificio.superficieEdificadaTotal",
            denominator: "parcela.superficie",
            operator: ">",
            value: 0.6,
          },
        ],
      },
      severity: "bloqueo",
      message: "Edificabilidad máxima RUAIS 2 plantas: 0,60.",
    };
    expect(evaluateRule(retranqueo, model)).not.toBeNull();
    expect(evaluateRule(edificabilidad, model)).not.toBeNull();
  });
});

describe("pack legible por máquina (fixture Granada, GR-URB-05 real)", () => {
  const pack = loadPack(resolve("tests", "fixtures", "granada-sample.json"));

  it("carga el pack con jurisdicción y reglas citables", () => {
    expect(pack.jurisdiction).toContain("Granada");
    expect(pack.rules.length).toBeGreaterThan(5);
    expect(pack.rules.some((r) => r.source.article.includes("7.3.23.2"))).toBe(true);
  });

  it("la regla real del PGOU bloquea un patio de 2,5 m (art. 7.3.23.2)", () => {
    const violations = evaluatePack(pack.rules, modelWithPatio(2.5, 4, 10, 9));
    expect(violations).toHaveLength(1);
    expect(violations[0].ruleId).toBe("GR-URB-05");
    expect(violations[0].message).toContain("7.3.23.2");
  });

  it("la regla real del PGOU pasa un patio conforme", () => {
    expect(evaluatePack(pack.rules, modelWithPatio(3.5, 4.2, 15, 9))).toHaveLength(0);
  });

  it("un pack malformado es rechazado por el loader", () => {
    expect(() => loadPack(resolve("tests", "fixtures", "no-existe.json"))).toThrow();
  });
});

describe("capacidades de IA (degradación elegante)", () => {
  it("sin GPU Flow configurado, todo el producto sigue en L0", () => {
    const caps = getCapabilities({});
    expect(caps.l2).toBe(false);
    expect(caps.l3).toBe(false);
    expect(caps.embeddings).toBe(false);
  });

  it("con modelo L2 configurado, la capacidad se enciende", () => {
    const caps = getCapabilities({
      GPUFLOW_API_KEY: "x",
      GPUFLOW_BASE_URL: "https://example.test/v1",
      GPUFLOW_MODEL_L2: "small",
    });
    expect(caps.l2).toBe(true);
    expect(caps.l3).toBe(false);
  });
});
