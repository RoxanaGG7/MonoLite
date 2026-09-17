import type { KernelModel } from "./kernel.js";
import { deriveEdificio, derivePatio } from "./kernel.js";
import { areaPoligono, distanciaEntrePoligonos, distanciaMinimaLinderos } from "./geometry.js";

export function buildModel(kernel: KernelModel): Record<string, unknown> {
  const parcela: Record<string, unknown> = { ...kernel.parcela };
  if (kernel.parcela.contorno && kernel.parcela.contorno.length >= 3) {
    parcela.superficie = areaPoligono(kernel.parcela.contorno);
  }
  const frontales = kernel.parcela.linderos.filter((l) => l.tipo === "frontal");
  if (frontales.length > 0) {
    parcela.longitudLinderoFrontal = Math.max(
      ...frontales.map((l) => Math.hypot(l.b.x - l.a.x, l.b.y - l.a.y))
    );
  }

  const edificio: Record<string, unknown> = { ...deriveEdificio(kernel.edificio) };
  if (kernel.edificio.huella.length >= 3) {
    edificio.superficieOcupadaProyectada = areaPoligono(kernel.edificio.huella);
    const distancia = distanciaMinimaLinderos(kernel.edificio.huella, kernel.parcela.linderos);
    if (distancia !== undefined) edificio.distanciaMinimaLinderos = distancia;
    let fachadaMax = 0;
    for (let i = 0; i < kernel.edificio.huella.length; i++) {
      const p1 = kernel.edificio.huella[i];
      const p2 = kernel.edificio.huella[(i + 1) % kernel.edificio.huella.length];
      fachadaMax = Math.max(fachadaMax, Math.hypot(p2.x - p1.x, p2.y - p1.y));
    }
    edificio.longitudMaximaFachada = fachadaMax;
  }

  const model: Record<string, unknown> = {
    parcela,
    edificio,
    entities: kernel.entities,
  };
  if (kernel.patio) model.patio = derivePatio(kernel.patio);
  if (kernel.patioVentilacion) model.patioVentilacion = derivePatio(kernel.patioVentilacion);
  if (kernel.patioManzana) model.patioManzana = { ...kernel.patioManzana };
  if (kernel.espacio) model.espacio = { ...kernel.espacio };

  if (kernel.edificio.huellaSotano && kernel.edificio.huellaSotano.length >= 3) {
    edificio.superficieSotano = areaPoligono(kernel.edificio.huellaSotano);
  }

  if (kernel.edificios && kernel.edificios.length >= 2) {
    const edificios = kernel.edificios;
    let mejor: { distancia: number; requerida: number } | undefined;
    for (let i = 0; i < edificios.length; i++) {
      for (let j = i + 1; j < edificios.length; j++) {
        const a = edificios[i];
        const b = edificios[j];
        const distancia = distanciaEntrePoligonos(a.huella, b.huella);
        const requerida =
          a.alturaMaxima === b.alturaMaxima
            ? a.alturaMaxima
            : (a.alturaMaxima + b.alturaMaxima) / 2;
        if (!mejor || distancia - requerida < mejor.distancia - mejor.requerida) {
          mejor = { distancia, requerida };
        }
      }
    }
    if (mejor) {
      model.edificios = {
        distanciaMinimaEntreEdificios: mejor.distancia,
        separacionRequeridaEntreEdificios: mejor.requerida,
      };
    }
  }

  return model;
}
