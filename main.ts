import { serve } from "std/http/server.ts";

import app from "~/app.ts";

try {
  await serve(app.fetch, {
    port: Number(Deno.env.get("PORT") || 7000),
    hostname: "0.0.0.0",
    onListen: ({ hostname, port }) => {
      console.log(`[flamrdevs-api]: ${hostname}:${port}`);
    },
  });
} catch (error) {
  console.error(error);
}
