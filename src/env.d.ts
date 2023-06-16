declare global {
  interface ExtendedEnv {
    readonly DENO_ENV?: "development" | "production";
    readonly PORT?: string;
    readonly KEY?: string;
  }

  namespace Deno {
    interface Env {
      delete(key: keyof ExtendedEnv): void;
      get<T extends keyof ExtendedEnv>(key: T): ExtendedEnv[T] | undefined;
      has(key: keyof ExtendedEnv): boolean;
      set<T extends keyof ExtendedEnv>(key: T, value: ExtendedEnv[T]): void;
    }
  }
}

export {};
