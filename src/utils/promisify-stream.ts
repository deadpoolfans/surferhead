import { Readable } from "node:stream";

// BUG: Not implemented in Bun, tracking <https://github.com/oven-sh/bun/issues/887>
// Should not be an issue here though since it's just a type import.
import type { ClientHttp2Stream } from "node:http2";

const promisifyStream = (stream: Readable, contentLength?: string): Promise<Buffer> => new Promise((resolve, reject) => {
  const chunks: Buffer[] = [];

  let currentLocationInLength = 0;
  const finalLength = typeof contentLength === "string" ? parseInt(contentLength, 10) : null;

  // If the session is using `http2`, we get the session from the stream.
  const http2session = finalLength === null && "session" in stream && (stream as ClientHttp2Stream).session || null;

  let isResolved = false;
  let timeout: ReturnType<typeof setTimeout>;

  stream.on("data", (chunk: Buffer) => {
    chunks.push(chunk);
    currentLocationInLength += chunk.length;

    if (currentLocationInLength === finalLength) {
      isResolved = true;
      resolve(Buffer.concat(chunks));
    }

    if (http2session !== null) {
      clearTimeout(timeout);

      const SESSION_PING_TIMEOUT = 2_000;
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const emptyFunction = () => {};

      timeout = setTimeout(() => http2session.ping(emptyFunction), SESSION_PING_TIMEOUT);
    }
  });

  stream.once("end", () => {
    clearTimeout(timeout);

    if (!isResolved)
      resolve(Buffer.concat(chunks));
  });

  stream.once("error", (error) => {
    clearTimeout(timeout);
    reject(error);
  });
});

export default promisifyStream;
