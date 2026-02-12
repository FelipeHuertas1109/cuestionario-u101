// URLs relativas: Next.js rewrites las redirige al backend externo
// Esto evita problemas de CORS tanto en desarrollo como en produccion
const BASE_URL = "";

export const API_URLS = {
  resumen: `${BASE_URL}/api/dashboard/resumen/`,
  estadisticas: `${BASE_URL}/api/dashboard/estadisticas/`,
  votosPorFecha: `${BASE_URL}/api/dashboard/votos-por-fecha/`,
  votosPorHora: `${BASE_URL}/api/dashboard/votos-por-hora/`,
  respuestas: `${BASE_URL}/api/dashboard/respuestas/?limit=50`,
};

// Types

export interface Candidato {
  letra: string;
  nombre: string;
  votos: number;
  porcentaje: number;
  color: string;
}

export interface Resumen {
  total_mensajes: number;
  total_votos_validos: number;
  total_invalidos: number;
  candidatos: Candidato[];
  actualizado_en: string;
}

export interface Estadisticas {
  total_mensajes: number;
  total_votos_validos: number;
  total_invalidos: number;
  contactos_unicos: number;
  tasa_validos: number;
  ultima_respuesta: string;
  actualizado_en: string;
}

export interface VotosPorFecha {
  total_dias: number;
  datos: { fecha: string; votos: number }[];
}

export interface VotosPorHora {
  total_periodos: number;
  datos: { hora: string; votos: number }[];
}

export interface Respuesta {
  id: number;
  contact_id: number;
  telefono: string;
  nombre: string;
  texto: string;
  voto: string;
  candidato: string;
  canal: string;
  fecha: string;
}

export interface RespuestasResponse {
  total: number;
  respuestas: Respuesta[];
}
