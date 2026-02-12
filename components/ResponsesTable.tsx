"use client";

import { useAutoRefresh } from "./useAutoRefresh";
import { API_URLS, type RespuestasResponse } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function ResponsesTable() {
  const { data, loading, error } = useAutoRefresh<RespuestasResponse>(
    API_URLS.respuestas,
    15000
  );

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-50 rounded-lg mb-2" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <p className="text-red-500 text-sm">Error cargando respuestas: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Respuestas en Vivo
          </h2>
          <p className="text-sm text-gray-500">
            {data.total} respuestas registradas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs text-gray-500">Auto-refresh activo</span>
        </div>
      </div>

      <div className="overflow-x-auto -mx-6">
        <div className="inline-block min-w-full px-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Telefono
                </th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Respuesta
                </th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Voto
                </th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Canal
                </th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tiempo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.respuestas.map((resp) => (
                <tr
                  key={resp.id}
                  className="hover:bg-gray-50/70 transition-colors duration-150"
                >
                  <td className="py-3 px-3 font-medium text-gray-900 whitespace-nowrap">
                    {resp.nombre || (
                      <span className="text-gray-400 italic">Sin nombre</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-gray-500 font-mono text-xs whitespace-nowrap">
                    {resp.telefono}
                  </td>
                  <td className="py-3 px-3 text-gray-600 max-w-[200px] truncate">
                    {resp.texto}
                  </td>
                  <td className="py-3 px-3">
                    {resp.voto ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {resp.candidato || resp.voto.toUpperCase()}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
                        Invalido
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                      {resp.canal}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-400 text-xs whitespace-nowrap">
                    {formatDistanceToNow(new Date(resp.fecha), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {data.respuestas.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <svg
                className="w-10 h-10 mx-auto mb-3 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p>No hay respuestas registradas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
