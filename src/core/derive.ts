import type { KernelModel } from "./kernel.js";
import { deriveEdificio, derivePatio } from "./kernel.js";
import { areaPoligono, distanciaMinimaLinderos } from "./geometry.js";

export function buildModel(kernel: KernelModel): Record<string, unknown> {
  const parcela: Record<string, unknown> = { ...kernel.parcela };
  if (kernel.parcela.contorno && kernel.parcela.contorno.length >= 3) {
    parcela.superficie = areaPoligono(kernel.parcela.contorno);
  }

  const edificio: Record<string, unknown> = { ...deriveEdificio(kernel.edificio) };
  if (kernel.edificio.huella.length >= 3) {
    edificio.superficieOcupadaProyectada = areaPoligono(kernel.edificio.huella);
    const distancia = distanciaMinimaLinderos(kernel.edificio.huella, kernel.parcela.linderos);
    if (distancia !== undefined) edificio.distanciaMinimaLinderos = distancia;
  }

  const model: Record<string, unknown> = {
    parcela,
    edificio,
    entities: kernel.entities,
  };
  if (kernel.patio) model.patio = derivePatio(kernel.patio);
  if (kernel.patioVentilacion) model.patioVentilacion = derivePatio(kernel.patioVentilacion);
  if (kernel.espacio) model.espacio = { ...kernel.espacio };
  return model;
}
