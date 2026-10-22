export type Idioma = "es" | "en";

let idioma: Idioma = "es";

export function setIdioma(i: Idioma): void {
  idioma = i;
}
export function getIdioma(): Idioma {
  return idioma;
}

const DICT: Record<string, [string, string]> = {
  /* Header */
  "cargar-ifc": ["Cargar IFC", "Load IFC"],
  "informe": ["Informe", "Report"],
  "idioma-es": ["Español", "Spanish"],
  "idioma-en": ["English", "English"],

  /* Búsqueda */
  "placeholder-dir": ["Dirección de tu proyecto", "Your project address"],
  "buscar": ["Buscar", "Search"],
  "buscando": ["Buscando dirección…", "Searching address…"],
  "parcela-cargada": ["Parcela", "Parcel"],
  "cargada": ["cargada", "loaded"],
  "cal-ruais": ["calificación RUAIS detectada en la capa del PGOU", "RUAIS zoning detected in the plan layer"],
  "cal-otra": ["la capa indica calificación", "the layer shows zoning"],
  "cal-otra2": [": sin pack para evaluarla", ": no pack available to evaluate it"],
  "cal-sin": ["sin cobertura en la capa de calificaciones: zona pendiente de trazado", "no coverage in the zoning layer: area pending tracing"],
  "no-encontre": ["No encontré esa parcela", "Parcel not found"],
  "consultando": ["Consultando el catastro…", "Querying the cadastre…"],

  /* Franja */
  "altura-max": ["Altura máxima", "Maximum height"],
  "fija-norma": ["fija la norma · art.", "set by the code · art."],
  "sin-regla": ["sin regla en el pack", "no rule in the pack"],
  "plantas": ["Plantas", "Floors"],
  "max-construible": ["máximo construible:", "maximum buildable:"],
  "planta-sing": ["planta", "floor"],
  "planta-plur": ["plantas", "floors"],

  /* Leyenda */
  "ley-zona": ["zona construible · retranqueo mín. 3 m", "buildable area · minimum setback 3 m"],
  "ley-frente": ["frente a vía pública", "frontage to public road"],

  /* Estado vacío */
  "empieza": ["EMPIEZA AQUÍ", "START HERE"],
  "busca-parcela": ["Busca una parcela.", "Search for a parcel."],
  "busca-hint": ["Escribe una dirección o coordenadas en la barra superior y pulsa Buscar.", "Type an address or coordinates in the top bar and press Search."],
  "plano-vacio": ["Busca una parcela para empezar", "Search for a parcel to start"],

  /* Veredicto */
  "rojo": ["ROJO", "RED"],
  "ambar": ["ÁMBAR", "AMBER"],
  "verde": ["VERDE", "GREEN"],
  "sin-modelo": ["SIN MODELO", "NO MODEL"],
  "sin-pack": ["SIN PACK", "NO PACK"],
  "h1-rojo": ["Aún no es tramitable.", "Not submittable yet."],
  "h1-ambar": ["Tramitable, con una condición.", "Submittable, with one condition."],
  "h1-verde": ["Tramitable.", "Submittable."],
  "h1-sin-modelo": ["Sin modelo aún.", "No model yet."],
  "h1-no-cabe": ["No cabe edificio.", "No building fits."],
  "sub-rojo-plur": ["incumplimientos", "violations"],
  "sub-rojo-sing": ["incumplimiento", "violation"],
  "sub-ambar": ["falta confirmar un dato del sitio", "one site condition needs confirmation"],
  "sub-verde": ["sin incumplimientos en lo evaluado", "no violations in what was evaluated"],
  "sub-sin-modelo": ["la huella y la ocupación nacen al modelar tu primer elemento", "the footprint and build-out come alive when you model your first element"],
  "sub-no-huella": ["la forma modelada no genera huella válida", "the modeled shape yields no valid footprint"],
  "sub-no-evaluable": ["el pack cargado solo evalúa RUAIS", "the loaded pack only evaluates RUAIS"],
  "cumple-de": ["Cumple", "Meets"],
  "de-articulos": ["de", "of"],
  "evaluados": ["artículos evaluados", "articles evaluated"],
  "lo-que-falta": ["Lo que falta", "What is missing"],
  "la-norma-dice": ["LA NORMA DICE", "THE CODE SAYS"],
  "huella-de": ["huella de", "footprint of"],

  /* Paso modelo */
  "paso-modelo": ["Dibuja el perímetro para calcular", "Draw the perimeter to calculate"],
  "paso-modelo-det": ["La huella, la ocupación y el retranqueo nacen al modelar tu primer elemento", "Footprint, build-out and setback are born when you model your first element"],
  "paso-modelo-tools": ["herramientas ▭ y ⬡ sobre el plano · o importa tu modelo con Cargar IFC", "tools ▭ and ⬡ on the plan · or import your model with Load IFC"],

  /* Acciones de reglas */
  "accion-altura": ["Baja la altura", "Lower the height"],
  "accion-separar": ["Separa", "Set back"],
  "mas-de-cada-lindero": ["m más de cada lindero", "m more from each boundary"],
  "accion-ocupacion": ["Reduce la huella", "Reduce the footprint"],
  "accion-edificabilidad": ["Quita", "Remove"],
  "m2-construidos": ["m² construidos", "m² built"],
  "exige": ["Exige", "Requires"],
  "tienes": ["tienes", "you have"],
  "nombre-altura": ["altura", "height"],
  "nombre-separacion": ["separaci\u00f3n", "setback"],
  "nombre-ocupacion": ["ocupaci\u00f3n", "footprint"],
  "nombre-edificabilidad": ["edificabilidad", "buildability"],
  "nombre-patio": ["patio", "courtyard"],
  "revisa-linderos": ["Confirma qu\u00e9 lindero da a la v\u00eda p\u00fablica", "Confirm which boundary faces the public road"],

  /* Condiciones de sitio */
  "sitio-lind-accion": ["Confirma qué lindero da a la vía pública", "Confirm which boundary faces the public road"],
  "sitio-lind-exige": ["revisión humana", "human review"],
  "sitio-lind-conf": ["confirmado", "confirmed"],
  "sitio-lind-sinconf": ["sin confirmar", "unconfirmed"],
  "sitio-lind-nombre": ["linderos", "boundaries"],
  "sitio-cal-nombre": ["calificación", "zoning"],
  "sitio-cal-exige": ["cobertura de la capa de calificaciones", "zoning layer coverage"],
  "sitio-cal-ok": ["RUAIS en zona trazada", "RUAIS in a traced area"],
  "sitio-cal-sin": ["zona sin cobertura en la capa", "area without layer coverage"],
  "sitio-cal-accion": ["Zona pendiente de trazado en la capa — el equipo la verifica contra el plano de usos", "Area pending tracing in the layer — the team verifies it against the official use plan"],

  /* Modal lindero */
  "modal-lind-over": ["CONFIRMA EL SITIO", "CONFIRM THE SITE"],
  "modal-lind-preg": ["¿Es este lindero el frente a la vía pública?", "Is this boundary the frontage to the public road?"],
  "modal-lind-si": ["Sí, es el frente", "Yes, it is the frontage"],
  "cancelar": ["Cancelar", "Cancel"],

  /* Modal calificación */
  "modal-cal-over": ["CAPA DE CALIFICACIONES", "ZONING LAYER"],
  "modal-cal-preg": ["¿Qué calificación tiene el polígono trazado?", "What zoning does the traced polygon have?"],
  "modal-cal-anadir": ["Añadir a la capa", "Add to layer"],
  "modal-cal-descartar": ["Descartar", "Discard"],
  "modal-cal-pista": ["traza el contorno de la zona de unifamiliares: sus bordes son calles o el cambio de tejido visible en la foto", "trace the detached-houses area: its edges are streets or the visible fabric change in the photo"],
  "cal-ruais-op": ["RUAIS (unifamiliar aislada)", "RUAIS (detached single-family)"],
  "cal-ruas-op": ["RUAS (residencial en suelo urbano)", "RUAS (urban residential)"],
  "cal-casco-op": ["Casco urbano", "Urban core"],
  "cal-otra-op": ["Otra / sin determinar", "Other / undetermined"],

  /* Mensajes de herramientas */
  "no-cabe": ["No cabe dentro de la zona construible; reduce las medidas.", "It does not fit in the buildable area; reduce the dimensions."],
  "no-cabe-medidas": ["Con esas medidas el elemento no cabe en la zona construible.", "With those dimensions the element does not fit in the buildable area."],
  "forma-se-sale": ["La forma se sale de la zona construible: ajusta los vértices.", "The shape leaves the buildable area: adjust the vertices."],
  "alineacion-no-cabe": ["La alineación saca el elemento de la zona construible: no cabe contra esa cara.", "The alignment takes the element out of the buildable area: it does not fit against that face."],
  "elige-otra-cara": ["Elige una cara de otro elemento o del perímetro de la zona.", "Choose a face of another element or of the area perimeter."],
  "pulsa-cara": ["Pulsa sobre un elemento o sobre el perímetro de la zona para elegir la cara.", "Click an element or the area perimeter to choose a face."],
  "largo": ["largo", "length"],
  "ancho": ["ancho", "width"],
  "aplicar": ["Aplicar", "Apply"],

  /* Zona del plano */
  "zona-no-evaluable": ["Zona", "Zoning"],
  "no-pack-zona": [": no hay pack para evaluarla", ": no pack available to evaluate it"],

  /* Textos normativos (traducci\u00f3n no oficial del PGOU) */
  "norma-01A": [
    "La altura m\u00e1xima, medida en unidades m\u00e9tricas, es la distancia desde la cota de referencia hasta la intersecci\u00f3n de la cara superior del forjado que forma el techo de la \u00faltima planta con el plano de la fachada del edificio. La altura m\u00e1xima se fija en las condiciones de calificaci\u00f3n como valor l\u00edmite.",
    "The maximum height, measured in metric units, is the distance from the reference level to the intersection of the upper face of the slab forming the roof of the top floor with the plane of the building fa\u00e7ade. The maximum height is set in the zoning conditions as a limit value.",
  ],
  "norma-01B": [
    "Para edificios de dos plantas, se fija una altura m\u00e1xima de setecientos noventa (790) cent\u00edmetros.",
    "For two-storey buildings, a maximum height of seven hundred and ninety (790) centimetres is set.",
  ],
  "norma-01C": [
    "Para edificios de tres plantas, se fija una altura m\u00e1xima de mil ciento veinte (1120) cent\u00edmetros.",
    "For three-storey buildings, a maximum height of one thousand one hundred and twenty (1120) centimetres is set.",
  ],
  "norma-02": [
    "En el caso de proyectos unitarios de viviendas aisladas, dichos retranqueos obedecer\u00e1n a ritmos uniformes, siendo sus valores m\u00ednimos de tres (3) metros.",
    "For single-family detached projects, setbacks shall follow uniform rhythms, with minimum values of three (3) metres.",
  ],
  "norma-03": [
    "La ocupaci\u00f3n m\u00e1xima en planta ser\u00e1 de un treinta por ciento, 30%, de la superficie de parcela para cada una de las plantas de la edificaci\u00f3n, incluida la baja.",
    "The maximum footprint per floor shall be thirty percent, 30%, of the plot area for each of the building's floors, including the ground floor.",
  ],
  "norma-04B": [
    "La edificaci\u00f3n de nueva planta tendr\u00e1 una edificabilidad neta en funci\u00f3n del n\u00famero de plantas m\u00e1ximo autorizado\u2026 para edificios de dos plantas: 0,60 m2 t/m2s.",
    "New-build construction shall have a net buildability depending on the maximum number of authorised storeys\u2026 for two-storey buildings: 0.60 m\u00b2 built / m\u00b2 plot.",
  ],
  "norma-05": [
    "La dimensi\u00f3n de cualquier lado del patio ser\u00e1 igual o superior a trescientos (300) cent\u00edmetros.",
    "Any side of the courtyard shall be equal to or greater than three hundred (300) centimetres.",
  ],
  "norma-sitio-lind": [
    "Condici\u00f3n del sitio: en parcelas con m\u00e1s de un lindero en contacto con vial o espacio p\u00fablico, todos tienen consideraci\u00f3n de lindero frontal (PGOU, art. 7.3.6). Confirma cu\u00e1l da a la v\u00eda p\u00fablica antes de tramitar.",
    "Site condition: on plots with more than one boundary in contact with a public way or space, all are considered front boundaries (PGOU, art. 7.3.6). Confirm which one faces the public road before submitting.",
  ],
  "norma-sitio-cal": [
    "El PGOU divide el municipio en zonas con reglas distintas (RUAIS, RUAS, casco, planes especiales\u2026). El pack cargado solo eval\u00faa RUAIS (art. 7.11): viviendas unifamiliares aisladas. La calificaci\u00f3n la determina la capa de calificaciones del PGOU que carga la herramienta; las zonas las traza y verifica el equipo MonoLite contra el plano de usos oficial.",
    "The PGOU divides the municipality into zones with different rules (RUAIS, RUAS, urban core, special plans\u2026). The loaded pack only evaluates RUAIS (art. 7.11): detached single-family housing. Zoning is determined by the PGOU zoning layer loaded by the tool; areas are traced and verified by the MonoLite team against the official use plan.",
  ],
  "art-sitio-lind": ["Art. 7.3.6 \u00b7 condici\u00f3n de sitio", "Art. 7.3.6 \u00b7 site condition"],
  "art-sitio-cal": ["Art. 7.11 \u00b7 condici\u00f3n de sitio", "Art. 7.11 \u00b7 site condition"],
  "fuente": ["PGOU Granada 2001 \u00b7 T\u00edtulo S\u00e9ptimo", "PGOU Granada 2001 \u00b7 Title VII"],
  "fuente-norma": ["PGOU Granada 2001", "PGOU Granada 2001"],

  /* Idioma */
  "tt-crear": ["Crear volumen rectangular", "Create rectangular volume"],
  "tt-vertices": ["Dibujar por v\u00e9rtices", "Draw by vertices"],
  "tt-girar": ["Girar libremente", "Rotate freely"],
  "tt-espejo-h": ["Espejo horizontal", "Horizontal mirror"],
  "tt-espejo-v": ["Espejo vertical", "Vertical mirror"],
  "tt-alinear": ["Alinear caras", "Align faces"],
  "tt-quitar": ["Quitar volumen", "Remove volume"],
  "tt-capa": ["Trazar calificaci\u00f3n sobre la zona", "Trace zoning over the area"],
  "tt-descargar": ["Descargar geojson de calificaciones", "Download zoning geojson"],
  "aria-altura": ["Altura del proyecto en metros", "Project height in metres"],
  "aria-plantas": ["N\u00famero de plantas", "Number of floors"],

  /* Informe */
  "inf-marca": ["MONOLITE · INFORME DE COMPATIBILIDAD URBANA", "MONOLITE · URBAN COMPLIANCE REPORT"],
  "inf-ref": ["Ref. catastral", "Cadastral ref."],
  "inf-calificacion": ["Calificación:", "Zoning:"],
  "inf-sin-determ": ["sin determinar", "undetermined"],
  "inf-cumple": ["CUMPLE", "MEETS"],
  "inf-no-cumple": ["NO CUMPLE", "VIOLATED"],
  "inf-pendiente": ["PENDIENTE", "PENDING"],
  "inf-croquis": ["Croquis del terreno", "Site sketch"],
  "inf-datos": ["Datos del proyecto", "Project data"],
  "inf-plantas": ["Plantas", "Floors"],
  "inf-segun-ifc": ["(según IFC importado)", "(from imported IFC)"],
  "inf-altura": ["Altura del proyecto", "Project height"],
  "inf-alt-max-legal": ["altura máxima legal:", "legal maximum height:"],
  "inf-retranqueo": ["Retranqueo a linderos", "Setback to boundaries"],
  "inf-min-legal": ["mínimo legal:", "legal minimum:"],
  "inf-dist-proy": ["distancia del proyecto:", "project distance:"],
  "inf-elementos": ["Elementos", "Elements"],
  "inf-huella-ifc": ["(huella IFC importada)", "(imported IFC footprint)"],
  "inf-ocup-total": ["ocupación total:", "total footprint:"],
  "inf-articulos": ["Artículos evaluados", "Evaluated articles"],
  "inf-la-norma": ["La norma dice.", "The code says."],
  "inf-huella": ["huella de", "footprint of"],
};

export function t(k: string): string {
  const e = DICT[k];
  if (!e) return k;
  return idioma === "en" ? e[1] : e[0];
}
