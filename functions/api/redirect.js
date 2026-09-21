export async function onRequestGet({ request, env }) {
  const requestedWith = request.headers.get("X-Requested-With");

  if (requestedWith !== "XMLHttpRequest") {
    return new Response("Forbidden", {
      status: 403,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }

  if (!env.DESTINATION_URL) {
    return new Response("Destination is not configured", {
      status: 500,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }

  return Response.json(
    {
      url: env.DESTINATION_URL,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Referrer-Policy": "no-referrer",
      },
    }
  );
}
