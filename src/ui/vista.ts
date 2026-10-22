export type Severidad = 'bloqueo' | 'ambar' | 'aviso';
export type EstadoGlobal = 'rojo' | 'ambar' | 'verde' | 'sin-envolvente' | 'no-evaluable';

export interface ResultadoRegla {
  id: string;
  severidad: Severidad;
  cumple: boolean;
  nombreCorto: string;
  textoNorma: string;
  articulo: string;
  fuente: string;
  exige: string;
  valorProyecto: string;
  accion: string;
  anclaPlano?: { x: number; y: number };
}

export function estadoGlobal(rs: ResultadoRegla[], sinEnvolvente: boolean): EstadoGlobal {
  if (sinEnvolvente) return 'sin-envolvente';
  if (rs.some(r => !r.cumple && r.severidad === 'bloqueo')) return 'rojo';
  if (rs.some(r => !r.cumple && r.severidad === 'ambar')) return 'ambar';
  return 'verde';
}

export function pasos(rs: ResultadoRegla[]) {
  const peso = (r: ResultadoRegla) => (r.severidad === 'bloqueo' ? 0 : 2) + (r.anclaPlano ? 0 : 1);
  return rs.filter(r => !r.cumple).sort((a, b) => peso(a) - peso(b)).map((r, i) => ({ ...r, n: i + 1 }));
}

export const fmt = (v: number, d = 2) => v.toFixed(d).replace('.', ',');
