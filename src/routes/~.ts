import { route } from "~/libs/hono.ts";

import dayjs from "dayjs";

export default route((x) => {
  let last: string | undefined;
  x.get("/last", (ctx) => {
    return ctx.json({
      last: (last ??= dayjs().format()),
    });
  });

  return x;
});
