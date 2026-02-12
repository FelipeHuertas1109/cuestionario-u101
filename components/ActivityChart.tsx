"use client";

import { useAutoRefresh } from "./useAutoRefresh";
import { API_URLS, type VotosPorHora } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";

export default function ActivityChart() {
  const { data, loading, error } = useAutoRefresh<VotosPorHora>(
    API_URLS.votosPorHora
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
          Actividad por Hora
        </h2>
        <p className="text-red-500 text-sm">Error: {error}</p>
      </div>
    );
  }

  if (data.datos.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Actividad por Hora
        </h2>
        <div className="h-56 flex items-center justify-center text-gray-400">
          Sin datos disponibles
        </div>
      </div>
    );
  }

  const formattedData = data.datos.map((d) => ({
    ...d,
    horaLabel: format(parseISO(d.hora), "HH:mm"),
  }));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Actividad por Hora
        </h2>
        <p className="text-sm text-gray-500">
          {data.total_periodos} periodos registrados
        </p>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="horaLabel"
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
            formatter={(value) => [`${value} votos`, "Actividad"]}
          />
          <Bar
            dataKey="votos"
            fill="#8B5CF6"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
