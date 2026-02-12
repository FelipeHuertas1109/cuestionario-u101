"use client";

import { useAutoRefresh } from "./useAutoRefresh";
import { API_URLS, type VotosPorFecha } from "@/lib/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export default function TimelineChart() {
  const { data, loading, error } = useAutoRefresh<VotosPorFecha>(
    API_URLS.votosPorFecha,
    30000
  );

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6" />
        <div className="h-56 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Votos por Dia
        </h2>
        <p className="text-red-500 text-sm">Error: {error}</p>
      </div>
    );
  }

  if (data.datos.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Votos por Dia
        </h2>
        <div className="h-56 flex items-center justify-center text-gray-400">
          Sin datos disponibles
        </div>
      </div>
    );
  }

  const formattedData = data.datos.map((d) => ({
    ...d,
    fechaLabel: format(parseISO(d.fecha), "dd MMM", { locale: es }),
  }));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Votos por Dia</h2>
        <p className="text-sm text-gray-500">
          {data.total_dias} dias con actividad
        </p>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="gradientVotos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="fechaLabel"
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              fontSize: "13px",
            }}
            formatter={(value) => [`${value} votos`, "Votos"]}
          />
          <Area
            type="monotone"
            dataKey="votos"
            stroke="#3B82F6"
            strokeWidth={2.5}
            fill="url(#gradientVotos)"
            dot={{ fill: "#3B82F6", strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: "#3B82F6", strokeWidth: 2, stroke: "#fff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
