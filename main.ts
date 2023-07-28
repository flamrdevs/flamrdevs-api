import app from "~/app.ts";

try {
  Deno.serve(
    {
      port: Number(Deno.env.get("PORT") || 7000),
      hostname: "0.0.0.0",
      onListen: ({ hostname, port }) => {
        console.log(`[flamrdevs-api]: ${hostname}:${port}`);
      },
    },
    app.fetch
  );
} catch (error) {
  console.error(error);
}
