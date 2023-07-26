import { time } from "~/libs/exports.ts";

type Item<T> = {
  e: number;
  v: T;
};

const cache = <T>(defaultAge = time.day(1)) => {
  const map = new Map<string, Item<T>>();

  return {
    get: (key: string) => {
      const item = map.get(key);
      if (typeof item !== "undefined" && Date.now() < item.e) return item.v;
    },
    set: (key: string, value: T, age?: number) => {
      map.set(key, { e: Date.now() + (typeof age === "number" ? age : defaultAge), v: value });
      return value;
    },
  };
};

export default cache;
