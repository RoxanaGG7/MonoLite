import type { KernelModel, Punto } from "./kernel.js";

export interface ExtractoIFC {
  fuente?: { ifc?: string; extractor?: string };
  crs?: string;
  origenUTM?: { x: number; y: number };
  georreferencia?: { lat: number; lon: number } | null;
  nota?: string;
  edificio: {
    huella: Punto[];
    numeroPlantas: number;
    alturaMaxima: number;
    superficieOcupadaProyectada: number;
    superficieEdificadaTotal: number;
  };
}

export function extractoAKernel(extracto: ExtractoIFC, kernel: KernelModel): KernelModel {
  return {
    ...kernel,
    edificio: {
      ...kernel.edificio,
      alturaMaxima: extracto.edificio.alturaMaxima,
      numeroPlantas: extracto.edificio.numeroPlantas,
      superficieEdificadaTotal: extracto.edificio.superficieEdificadaTotal,
      superficieOcupadaProyectada: extracto.edificio.superficieOcupadaProyectada,
      huella: extracto.edificio.huella,
    },
    entities: kernel.entities,
  };
}
