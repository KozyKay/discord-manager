const DISCORD_API = "https://discord.com/api/v10";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, PATCH, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const discordPath = url.pathname.replace(/^\/discord/, "");
    const discordUrl = `${DISCORD_API}${discordPath}`;

    const body = request.method !== "GET" && request.method !== "DELETE"
      ? await request.text()
      : undefined;

    const discordRes = await fetch(discordUrl, {
      method: request.method,
      headers: {
        Authorization: `Bot ${env.Bot_Token}`,
        "Content-Type": "application/json",
      },
      body,
    });

    const resBody = discordRes.status === 204 ? null : await discordRes.text();

    return new Response(resBody, {
      status: discordRes.status,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
      },
    });
  },
};