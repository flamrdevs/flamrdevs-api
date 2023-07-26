import { ENV, HOST } from "~/const/exports.ts";

export const SITE = (...paths: string[]) => [ENV.__PROD__ ? HOST.SITE_PROD : HOST.SITE_DEV, ...paths].join("/");

export const STATIC = (...paths: string[]) => [ENV.__PROD__ ? HOST.STATIC_PROD : HOST.STATIC_DEV, ...paths].join("/");

export const WEB = (...paths: string[]) => [ENV.__PROD__ ? HOST.WEB_PROD : HOST.WEB_DEV, ...paths].join("/");

export const API = (...paths: string[]) => [ENV.__PROD__ ? HOST.API_PROD : HOST.API_DEV, ...paths].join("/");

export const IMAGE = (...paths: string[]) => [ENV.__PROD__ ? HOST.IMAGE_PROD : HOST.IMAGE_DEV, ...paths].join("/");
