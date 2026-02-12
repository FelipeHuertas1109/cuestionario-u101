import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const revalidate = 0;

const BACKEND_ORIGIN = "https://cuestionario-mu.vercel.app";

type RouteContext = {
  params: Promise<{ path?: string[] }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;
  const segments = path.filter(Boolean);

  // request.nextUrl.search ya incluye el prefijo "?" o viene vacío
  const query = request.nextUrl.search;

  // Siempre agregamos trailing slash para evitar redirects de Django (APPEND_SLASH)
  const backendUrl =
    segments.length > 0
      ? `${BACKEND_ORIGIN}/api/dashboard/${segments.join("/")}/${query}`
      : `${BACKEND_ORIGIN}/api/dashboard/${query}`;

  console.log(`[API Proxy] ${request.nextUrl.pathname}${query} -> ${backendUrl}`);

  const upstream = await fetch(backendUrl, {
    cache: "no-store",
    headers: {
      // Dejamos que Django decida el content-type; pero pedimos JSON
      Accept: "application/json, text/plain;q=0.9, */*;q=0.8",
    },
  });

  const contentType = upstream.headers.get("content-type") ?? "text/plain";
  const bodyText = await upstream.text();

  return new Response(bodyText, {
    status: upstream.status,
    headers: {
      "content-type": contentType,
      // Evita caches intermedios
      "cache-control": "no-store",
    },
  });
}

