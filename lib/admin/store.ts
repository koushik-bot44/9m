import { promises as fs } from "node:fs";
import path from "node:path";

// Uploaded reels and reviews live on the server's disk, in DATA_DIR (default: ./data).
// The host needs a persistent disk; on a serverless host, point this at mounted storage first.

export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

export type StoredReel = { id: string; title: string; file: string; createdAt: string };
export type StoredReview = { id: string; name: string; car: string; service: string; rating: number; text: string; photo: string; createdAt: string };

export const mediaUrl = (kind: "reels" | "reviews", file: string) => `/api/media/${kind}/${file}`;

async function read<T>(name: string): Promise<T[]> {
  try {
    const rows: unknown = JSON.parse(await fs.readFile(path.join(DATA_DIR, name), "utf8"));
    return Array.isArray(rows) ? (rows as T[]) : [];
  } catch {
    return [];
  }
}

async function write<T>(name: string, rows: T[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const file = path.join(DATA_DIR, name);
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(rows, null, 2));
  await fs.rename(tmp, file);
}

// One change at a time, so two uploads can never overwrite each other's list.
let queue: Promise<unknown> = Promise.resolve();
function serial<T>(job: () => Promise<T>): Promise<T> {
  const run = queue.then(job, job);
  queue = run.catch(() => undefined);
  return run;
}

function table<T extends { id: string }>(name: string, kind: "reels" | "reviews", fileOf: (row: T) => string) {
  return {
    list: () => read<T>(name),
    add: (row: T) =>
      serial(async () => {
        const rows = await read<T>(name);
        rows.unshift(row);
        await write(name, rows);
      }),
    remove: (id: string) =>
      serial(async () => {
        const rows = await read<T>(name);
        const gone = rows.find((r) => r.id === id);
        if (!gone) return false;
        await write(
          name,
          rows.filter((r) => r.id !== id),
        );
        await fs.rm(path.join(UPLOADS_DIR, kind, fileOf(gone)), { force: true });
        return true;
      }),
  };
}

export const reels = table<StoredReel>("reels.json", "reels", (r) => r.file);
export const reviews = table<StoredReview>("reviews.json", "reviews", (r) => r.photo);
