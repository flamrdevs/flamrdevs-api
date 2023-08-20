console.time("initialize");
const app = (await import("~/app.ts")).default;
console.timeEnd("initialize");

try {
  const hostname = "0.0.0.0";
  const port = 7000;
  const onListen = () => console.log(`[flamrdevs-api]: ${hostname}:${port}`);
  const server = Deno.serve({ port, hostname, onListen }, app.fetch);
  await server.finished;
} catch (error) {
  console.error(error);
}
