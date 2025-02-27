import type { Readable } from "node:stream"; // Fully compatible with Bun
import type { ServerResponse, IncomingMessage } from "node:http"; // Fully compatible with Bun

import promisifyStream from "../utils/promisify-stream";
import BUILTIN_HEADERS from "../request-pipeline/builtin-header-names";

import { stringifyJSON } from "./json";

export const PREVENT_CACHING_HEADERS = {
  [BUILTIN_HEADERS.cacheControl]: "no-cache, no-store, must-revalidate",
  [BUILTIN_HEADERS.pragma]:       "no-cache"
};

export function addPreventCachingHeaders (res: ServerResponse): void {
  res.setHeader(BUILTIN_HEADERS.cacheControl, PREVENT_CACHING_HEADERS[BUILTIN_HEADERS.cacheControl]);
  res.setHeader(BUILTIN_HEADERS.pragma, PREVENT_CACHING_HEADERS[BUILTIN_HEADERS.pragma]);
}

export function respond204 (res: ServerResponse): void {
  res.statusCode = 204;
  res.end();
}

export function respond404 (res: any): void {
  res.statusCode = 404;
  res.end();
}

export function respond500 (res: ServerResponse, err = ""): void {
  res.statusCode = 500;
  res.end(err);
}

export function respondWithJSON (res: ServerResponse, data: object, skipContentType: boolean, shouldAcceptCrossOrigin?:boolean): void {
  if (!skipContentType)
    res.setHeader(BUILTIN_HEADERS.contentType, "application/json");

  // NOTE: GH-105
  addPreventCachingHeaders(res);

  if (shouldAcceptCrossOrigin)
    acceptCrossOrigin(res);

  res.end(data ? stringifyJSON(data) : "");
}

export const respondStatic = (req: IncomingMessage, res: any, resource: any, cachingOptions: any = {}): void => {
  const DEFAULT_CACHING_OPTIONS = {
    maxAge: 30,
    mustRevalidate: true
  };

  // Apply default options if no options are given.
  cachingOptions = Object.assign({}, DEFAULT_CACHING_OPTIONS, cachingOptions);

  if (resource.etag === req.headers[BUILTIN_HEADERS.ifNoneMatch]) {
    res.statusCode = 304;
    res.end();
  }
  else {
    const { maxAge, mustRevalidate } = cachingOptions;

    res.setHeader(BUILTIN_HEADERS.cacheControl, `max-age=${maxAge}${mustRevalidate ? ", must-revalidate" : ""}`);
    res.setHeader(BUILTIN_HEADERS.eTag, resource.etag);
    res.setHeader(BUILTIN_HEADERS.contentType, resource.contentType);
    res.end(resource.content);
  }
};

export function fetchBody (r: Readable, contentLength?: string): Promise<Buffer> {
  return promisifyStream(r, contentLength);
}

export function acceptCrossOrigin (res: ServerResponse) {
  res.setHeader("access-control-allow-origin", "*");
}
