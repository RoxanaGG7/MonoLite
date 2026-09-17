export type EntityId =
  | "parcela"
  | "espacio"
  | "muro"
  | "losa"
  | "cubierta"
  | "viga"
  | "pilar"
  | "abertura"
  | "escalera"
  | "trazado"
  | "punto";

export interface BaseEntity {
  id: string;
  type: EntityId;
}

export type LinderoTipo = "frontal" | "lateral" | "testero";

export interface Punto {
  x: number;
  y: number;
}

export interface Parcela extends BaseEntity {
  type: "parcela";
  superficie: number;
  crs?: string;
  contorno?: Punto[];
  linderos: Lindero[];
  cotaReferencia: number;
  calificacion?: string;
}

export interface Lindero {
  tipo: LinderoTipo;
  a: Punto;
  b: Punto;
}

export interface Espacio extends BaseEntity {
  type: "espacio";
  uso: string;
  superficie: number;
  alturaLibre: number;
  superficieHuecosIluminacion?: number;
  superficieVentilacionPracticable?: number;
}

export interface Muro extends BaseEntity {
  type: "muro";
  espesor: number;
  tipoConstructivo: string;
  transmitancia?: number;
}

export interface Edificio {
  alturaMaxima: number;
  numeroPlantas: number;
  superficieEdificadaTotal: number;
  superficieOcupadaProyectada: number;
  huella: Punto[];
  alturaCumbrera?: number;
  petoBarandillaAltura?: number;
  cerramientoAzoteaOpacoAltura?: number;
  cerramientoAzoteaRejadoAltura?: number;
  depositoAguaSobreAlturaMaxima?: number;
  cotaForjadoPBSobreReferencia?: number;
  cotaForjadoSemisotanoSobreReferencia?: number;
  separacionForjadoPBTerreno?: number;
  tieneSotanos?: number;
  numeroSotanos?: number;
  alturaLibreMinimaSotano?: number;
  alturaLibre75PorCientoPB?: number;
  superficiePlantaBaja?: number;
  superficieEntreplanta?: number;
  separacionEntreplantaFachada?: number;
  superficiePlantasSobreRasante?: number;
  superficieCuerposSalientesCubiertosCerrados?: number;
  superficieCuerposSalientesCubiertosAbiertos?: number;
  superficieCuartosServicio?: number;
  pendienteCubierta?: number;
  cubiertaSobreAlturaMaxima?: number;
  huellaSotano?: Punto[];
}

export interface EdificioDerived extends Edificio {
  cumbreraMaxima: number;
}

export function deriveEdificio(edificio: Edificio): EdificioDerived {
  return { ...edificio, cumbreraMaxima: edificio.alturaMaxima + 2 };
}

export interface Patio {
  tipo?: "luces" | "ventilacion";
  anchoMinimo: number;
  largoMinimo: number;
  superficieUtil: number;
  alturaVinculada: number;
}

export interface PatioDerived extends Patio {
  diametroMinimoRequerido: number;
}

export function derivePatio(patio: Patio): PatioDerived {
  const esVentilacion = patio.tipo === "ventilacion";
  return {
    ...patio,
    diametroMinimoRequerido: esVentilacion
      ? Math.max(2, patio.alturaVinculada / 5)
      : Math.max(3, patio.alturaVinculada / 3),
  };
}

export interface KernelModel {
  parcela: Parcela;
  edificio: Edificio;
  edificios?: Edificio[];
  patio?: Patio;
  patioVentilacion?: Patio;
  espacio?: Espacio;
  entities: BaseEntity[];
}
