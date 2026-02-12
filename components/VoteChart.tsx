"use client";

import { useAutoRefresh } from "./useAutoRefresh";
import { API_URLS, type Resumen } from "@/lib/api";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function VoteChart() {
  const { data, loading, error } = useAutoRefresh<Resumen>(
    API_URLS.resumen,
    15000
  );

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6" />
        <div className="h-72 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <p className="text-red-500 text-sm">Error cargando datos: {error}</p>
      </div>
    );
  }

  const candidatosConVotos = data.candidatos.filter((c) => c.votos > 0);
  const todosLosCandidatos = data.candidatos;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Distribucion de Votos
          </h2>
          <p className="text-sm text-gray-500">
            {data.total_votos_validos} votos validos de {data.total_mensajes}{" "}
            respuestas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs text-gray-400">En vivo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="flex items-center justify-center">
          {candidatosConVotos.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={candidatosConVotos}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={115}
                  paddingAngle={3}
                  dataKey="votos"
                  nameKey="nombre"
                  strokeWidth={0}
                >
                  {candidatosConVotos.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value} votos`,
                    name,
                  ]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    fontSize: "13px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <svg
                  className="w-12 h-12 mx-auto mb-3 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  />
                </svg>
                <p>Sin votos aun</p>
              </div>
            </div>
          )}
        </div>

        {/* Candidate Progress Bars */}
        <div className="space-y-5 flex flex-col justify-center">
          {todosLosCandidatos.map((candidato) => (
            <div key={candidato.letra}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full inline-block flex-shrink-0"
                    style={{ backgroundColor: candidato.color }}
                  />
                  <span className="text-sm font-semibold text-gray-800">
                    {candidato.nombre}
                  </span>
                  <span className="text-xs text-gray-400 font-mono uppercase bg-gray-50 px-1.5 py-0.5 rounded">
                    {candidato.letra}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    {candidato.votos}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({candidato.porcentaje.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.max(
                      candidato.porcentaje,
                      candidato.votos > 0 ? 2 : 0
                    )}%`,
                    backgroundColor: candidato.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
