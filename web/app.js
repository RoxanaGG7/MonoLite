"use strict";
(() => {
  // src/core/kernel.ts
  function deriveEdificio(edificio) {
    return { ...edificio, cumbreraMaxima: edificio.alturaMaxima + 2 };
  }
  function derivePatio(patio) {
    const esVentilacion = patio.tipo === "ventilacion";
    return {
      ...patio,
      diametroMinimoRequerido: esVentilacion ? Math.max(2, patio.alturaVinculada / 5) : Math.max(3, patio.alturaVinculada / 3)
    };
  }

  // src/core/geometry.ts
  function distanciaPuntoSegmento(p, a, b) {
    const abx = b.x - a.x;
    const aby = b.y - a.y;
    const apx = p.x - a.x;
    const apy = p.y - a.y;
    const ab2 = abx * abx + aby * aby;
    if (ab2 === 0) return Math.hypot(apx, apy);
    const t = (apx * abx + apy * aby) / ab2;
    const tClamped = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (a.x + tClamped * abx), p.y - (a.y + tClamped * aby));
  }
  function distanciaSegmentoAPoligono(a, b, poligono) {
    let min = Infinity;
    for (const p of poligono) {
      min = Math.min(min, distanciaPuntoSegmento(p, a, b));
    }
    for (let i = 0; i < poligono.length; i++) {
      const q1 = poligono[i];
      const q2 = poligono[(i + 1) % poligono.length];
      min = Math.min(min, distanciaPuntoSegmento(a, q1, q2));
      min = Math.min(min, distanciaPuntoSegmento(b, q1, q2));
    }
    return min;
  }
  function distanciaHuellaLindero(huella2, lindero) {
    return distanciaSegmentoAPoligono(lindero.a, lindero.b, huella2);
  }
  function distanciaMinimaLinderos(huella2, linderos2) {
    if (huella2.length < 3 || linderos2.length === 0) return void 0;
    let min = Infinity;
    for (const lindero of linderos2) {
      min = Math.min(min, distanciaHuellaLindero(huella2, lindero));
    }
    return Number.isFinite(min) ? min : void 0;
  }
  function areaPoligono(poligono) {
    let area = 0;
    for (let i = 0; i < poligono.length; i++) {
      const p1 = poligono[i];
      const p2 = poligono[(i + 1) % poligono.length];
      area += p1.x * p2.y - p2.x * p1.y;
    }
    return Math.abs(area) / 2;
  }

  // src/core/derive.ts
  function buildModel(kernel) {
    const parcela = { ...kernel.parcela };
    if (kernel.parcela.contorno && kernel.parcela.contorno.length >= 3) {
      parcela.superficie = areaPoligono(kernel.parcela.contorno);
    }
    const edificio = { ...deriveEdificio(kernel.edificio) };
    if (kernel.edificio.huella.length >= 3) {
      edificio.superficieOcupadaProyectada = areaPoligono(kernel.edificio.huella);
      const distancia = distanciaMinimaLinderos(kernel.edificio.huella, kernel.parcela.linderos);
      if (distancia !== void 0) edificio.distanciaMinimaLinderos = distancia;
    }
    const model = {
      parcela,
      edificio,
      entities: kernel.entities
    };
    if (kernel.patio) model.patio = derivePatio(kernel.patio);
    if (kernel.patioVentilacion) model.patioVentilacion = derivePatio(kernel.patioVentilacion);
    if (kernel.espacio) model.espacio = { ...kernel.espacio };
    return model;
  }

  // src/engine/evaluator.ts
  var OPERATORS = {
    "<": (a, b) => a < b,
    "<=": (a, b) => a <= b,
    ">": (a, b) => a > b,
    ">=": (a, b) => a >= b,
    "==": (a, b) => a === b,
    "!=": (a, b) => a !== b
  };
  function resolveParameter(path, model) {
    let current = model;
    for (const key of path.split(".")) {
      if (current === null || current === void 0) return void 0;
      if (typeof current !== "object") return void 0;
      current = current[key];
    }
    return typeof current === "number" ? current : void 0;
  }
  function isRatioCondition(condition) {
    return "numerator" in condition;
  }
  function checkCondition(condition, model) {
    if (isRatioCondition(condition)) {
      const numerator = resolveParameter(condition.numerator, model);
      const denominator = resolveParameter(condition.denominator, model);
      if (numerator === void 0 || denominator === void 0 || denominator === 0) return false;
      return OPERATORS[condition.operator](numerator / denominator, condition.value);
    }
    const value = resolveParameter(condition.parameter, model);
    if (value === void 0) return false;
    const thresholdRaw = condition.value;
    const threshold = typeof thresholdRaw === "number" ? thresholdRaw : resolveParameter(thresholdRaw.param, model);
    if (threshold === void 0) return false;
    return OPERATORS[condition.operator](value, threshold);
  }
  function checkGroup(group, model) {
    const results = group.items.map((c) => ({ c, hit: checkCondition(c, model) }));
    const failed = results.filter((r) => r.hit).map((r) => r.c);
    if (group.mode === "all") return failed.length === group.items.length ? failed : [];
    return failed.length > 0 ? failed : [];
  }
  function evaluateRule(rule, model) {
    const failed = checkGroup(rule.conditions, model);
    if (failed.length === 0) return null;
    return {
      ruleId: rule.id,
      severity: rule.severity,
      message: rule.message,
      source: rule.source,
      failed
    };
  }
  function evaluatePack(rules, model) {
    return rules.map((r) => evaluateRule(r, model)).filter((v) => v !== null);
  }

  // tests/fixtures/granada-sample.json
  var granada_sample_default = {
    jurisdiction: "Granada (PGOU 2001)",
    version: "0.2.0",
    vigencia: "PGOU 2001 con adaptaciones posteriores (verificar BOP)",
    rules: [
      {
        id: "GR-RUAIS-01A",
        version: "0.1.0",
        jurisdiction: "Granada (PGOU 2001)",
        source: { document: "PGOU Granada 2001, T\xEDtulo S\xE9ptimo (Continuaci\xF3n)", article: "7.11.6.2.a" },
        scope: { calificacion: "RUAIS" },
        conditions: {
          mode: "all",
          items: [
            { parameter: "edificio.numeroPlantas", operator: "==", value: 1 },
            { parameter: "edificio.alturaMaxima", operator: ">", value: 4.6 }
          ]
        },
        severity: "bloqueo",
        message: "Edificio de 1 planta en calificaci\xF3n RUAIS: la altura m\xE1xima es de 4,60 m (art. 7.11.6.2.a)."
      },
      {
        id: "GR-RUAIS-01B",
        version: "0.1.0",
        jurisdiction: "Granada (PGOU 2001)",
        source: { document: "PGOU Granada 2001, T\xEDtulo S\xE9ptimo (Continuaci\xF3n)", article: "7.11.6.2.b" },
        scope: { calificacion: "RUAIS" },
        conditions: {
          mode: "all",
          items: [
            { parameter: "edificio.numeroPlantas", operator: "==", value: 2 },
            { parameter: "edificio.alturaMaxima", operator: ">", value: 7.9 }
          ]
        },
        severity: "bloqueo",
        message: "Edificio de 2 plantas en calificaci\xF3n RUAIS: la altura m\xE1xima es de 7,90 m (art. 7.11.6.2.b)."
      },
      {
        id: "GR-RUAIS-01C",
        version: "0.1.0",
        jurisdiction: "Granada (PGOU 2001)",
        source: { document: "PGOU Granada 2001, T\xEDtulo S\xE9ptimo (Continuaci\xF3n)", article: "7.11.6.2.c" },
        scope: { calificacion: "RUAIS" },
        conditions: {
          mode: "all",
          items: [
            { parameter: "edificio.numeroPlantas", operator: "==", value: 3 },
            { parameter: "edificio.alturaMaxima", operator: ">", value: 11.2 }
          ]
        },
        severity: "bloqueo",
        message: "Edificio de 3 plantas en calificaci\xF3n RUAIS: la altura m\xE1xima es de 11,20 m (art. 7.11.6.2.c)."
      },
      {
        id: "GR-RUAIS-02",
        version: "0.1.0",
        jurisdiction: "Granada (PGOU 2001)",
        source: { document: "PGOU Granada 2001, T\xEDtulo S\xE9ptimo (Continuaci\xF3n)", article: "7.11.3" },
        scope: { calificacion: "RUAIS" },
        conditions: {
          mode: "any",
          items: [
            { parameter: "edificio.distanciaMinimaLinderos", operator: "<", value: 3 }
          ]
        },
        severity: "bloqueo",
        message: "En calificaci\xF3n RUAIS la edificaci\xF3n debe separarse un m\xEDnimo de 3,00 m de todos los linderos (art. 7.11.3), medida en recta perpendicular al lindero (art. 7.3.6.1)."
      },
      {
        id: "GR-RUAIS-03",
        version: "0.1.0",
        jurisdiction: "Granada (PGOU 2001)",
        source: { document: "PGOU Granada 2001, T\xEDtulo S\xE9ptimo (Continuaci\xF3n)", article: "7.11.4.1" },
        scope: { calificacion: "RUAIS" },
        conditions: {
          mode: "all",
          items: [
            {
              numerator: "edificio.superficieOcupadaProyectada",
              denominator: "parcela.superficie",
              operator: ">",
              value: 0.3
            }
          ]
        },
        severity: "bloqueo",
        message: "La ocupaci\xF3n m\xE1xima en calificaci\xF3n RUAIS es del 30% de la superficie de parcela por planta (art. 7.11.4.1)."
      },
      {
        id: "GR-RUAIS-04B",
        version: "0.1.0",
        jurisdiction: "Granada (PGOU 2001)",
        source: { document: "PGOU Granada 2001, T\xEDtulo S\xE9ptimo (Continuaci\xF3n)", article: "7.11.8.1.b" },
        scope: { calificacion: "RUAIS" },
        conditions: {
          mode: "all",
          items: [
            { parameter: "edificio.numeroPlantas", operator: "==", value: 2 },
            {
              numerator: "edificio.superficieEdificadaTotal",
              denominator: "parcela.superficie",
              operator: ">",
              value: 0.6
            }
          ]
        },
        severity: "bloqueo",
        message: "Edificio de 2 plantas en calificaci\xF3n RUAIS: edificabilidad m\xE1xima 0,60 m\xB2t/m\xB2s (art. 7.11.8.1.b)."
      },
      {
        id: "GR-URB-05",
        version: "0.1.0",
        jurisdiction: "Granada (PGOU 2001)",
        source: {
          document: "PGOU Granada 2001, T\xEDtulo S\xE9ptimo",
          article: "7.3.23.2 (patios de luces)"
        },
        conditions: {
          mode: "any",
          items: [
            { parameter: "patio.anchoMinimo", operator: "<", value: 3 },
            {
              parameter: "patio.anchoMinimo",
              operator: "<",
              value: { param: "patio.diametroMinimoRequerido" }
            },
            { parameter: "patio.superficieUtil", operator: "<", value: 9 }
          ]
        },
        severity: "bloqueo",
        message: "El patio de luces no cumple las dimensiones m\xEDnimas del art. 7.3.23.2: lado \u2265 3,00 m, c\xEDrculo de di\xE1metro m\xE1x(3 m, H/3), superficie \u2265 9 m\xB2. La anchura m\xEDnima debe mantenerse en toda la altura (art. 7.3.22.3)."
      }
    ]
  };

  // src/ui/main.ts
  var ANCHO = 20;
  var LARGO = 15;
  var ESCALA = 26;
  var parcelaContorno = [
    { x: 0, y: 0 },
    { x: ANCHO, y: 0 },
    { x: ANCHO, y: LARGO },
    { x: 0, y: LARGO }
  ];
  var linderos = [
    { tipo: "frontal", a: { x: 0, y: 0 }, b: { x: ANCHO, y: 0 } },
    { tipo: "lateral", a: { x: 0, y: 0 }, b: { x: 0, y: LARGO } },
    { tipo: "lateral", a: { x: ANCHO, y: 0 }, b: { x: ANCHO, y: LARGO } },
    { tipo: "testero", a: { x: ANCHO, y: LARGO }, b: { x: 0, y: LARGO } }
  ];
  var COLOR_LINDERO = {
    frontal: "#2563eb",
    lateral: "#9ca3af",
    testero: "#7c3aed"
  };
  function huella(margen) {
    return [
      { x: margen, y: margen },
      { x: ANCHO - margen, y: margen },
      { x: ANCHO - margen, y: LARGO - margen },
      { x: margen, y: LARGO - margen }
    ];
  }
  function construirKernel(margen, plantas, altura, superficieEdificada) {
    return {
      parcela: {
        id: "p1",
        type: "parcela",
        crs: "EPSG:25830",
        superficie: 0,
        contorno: parcelaContorno,
        linderos,
        cotaReferencia: 0,
        calificacion: "RUAIS"
      },
      edificio: {
        alturaMaxima: altura,
        numeroPlantas: plantas,
        superficieEdificadaTotal: superficieEdificada,
        superficieOcupadaProyectada: 0,
        huella: huella(margen)
      },
      entities: []
    };
  }
  function puntosSVG(puntos) {
    return puntos.map((p) => `${p.x * ESCALA},${LARGO - p.y * ESCALA}`).join(" ");
  }
  function renderDibujo(margen, bloqueado) {
    const svg = document.getElementById("plano");
    const svgContent = `
    <polygon points="${puntosSVG(parcelaContorno)}" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    ${linderos.map(
      (l) => `<line x1="${l.a.x * ESCALA}" y1="${(LARGO - l.a.y) * ESCALA}" x2="${l.b.x * ESCALA}" y2="${(LARGO - l.b.y) * ESCALA}" stroke="${COLOR_LINDERO[l.tipo]}" stroke-width="3" stroke-dasharray="6 3"/>`
    ).join("\n")}
    <polygon points="${puntosSVG(huella(margen))}" fill="${bloqueado ? "#ef444433" : "#22c55e33"}" stroke="${bloqueado ? "#ef4444" : "#16a34a"}" stroke-width="2"/>
  `;
    svg.innerHTML = svgContent;
  }
  function renderInforme(violaciones, model) {
    const estado = document.getElementById("estado");
    const lista = document.getElementById("violaciones");
    const edificio = model.edificio;
    const parcela = model.parcela;
    if (violaciones.length === 0) {
      estado.textContent = "VERDE \u2014 TRAMITABLE";
      estado.className = "verde";
      lista.innerHTML = "<li class='ok'>Sin tachones. El proyecto cumple las reglas cargadas.</li>";
    } else {
      estado.textContent = `ROJO \u2014 ${violaciones.length} BLOQUEO${violaciones.length > 1 ? "S" : ""}`;
      estado.className = "rojo";
      lista.innerHTML = violaciones.map(
        (v) => `<li><strong>${v.ruleId}</strong> \u2014 ${v.message}<br/><em>Art.: ${v.source.article} (${v.source.document})</em></li>`
      ).join("");
    }
    const datos = document.getElementById("datos");
    datos.innerHTML = `
    <tr><td>Superficie de parcela (derivada)</td><td>${parcela.superficie.toFixed(2)} m\xB2</td></tr>
    <tr><td>Ocupaci\xF3n proyectada (derivada)</td><td>${edificio.superficieOcupadaProyectada.toFixed(2)} m\xB2</td></tr>
    <tr><td>Distancia m\xEDnima a lindero (derivada)</td><td>${edificio.distanciaMinimaLinderos !== void 0 ? edificio.distanciaMinimaLinderos.toFixed(2) + " m" : "\u2014"}</td></tr>
    <tr><td>Edificabilidad actual</td><td>${(Number(edificio.superficieEdificadaTotal) / Number(parcela.superficie)).toFixed(2)} m\xB2t/m\xB2s</td></tr>
  `;
  }
  function recalcular() {
    const margen = Number(document.getElementById("margen").value);
    const plantas = Number(document.getElementById("plantas").value);
    const altura = Number(document.getElementById("altura").value);
    const superficieEdificada = Number(document.getElementById("edificada").value);
    const kernel = construirKernel(margen, plantas, altura, superficieEdificada);
    const model = buildModel(kernel);
    const violaciones = evaluatePack(granada_sample_default.rules, model);
    document.getElementById("valorMargen").textContent = margen.toFixed(1) + " m";
    renderDibujo(margen, violaciones.length > 0);
    renderInforme(violaciones, model);
  }
  document.addEventListener("input", recalcular);
  recalcular();
})();
