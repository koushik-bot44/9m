"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Loader2, LogOut, Star, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type Reel = { id: string; title: string; src: string };
type ReviewRow = { id: string; name: string; car: string; service: string; rating: number; text: string; photo: { src: string; alt: string } };

const SERVICE_OPTIONS = ["PPF", "Ceramic coating", "Graphene coating", "Teflon coating", "Underbody coating", "Paint correction", "Full detailing", "Interior deep clean", "Full body wash", "Servicing", "Repairs"];

const input = "h-11 w-full rounded-[10px] border-[1.5px] border-input bg-transparent px-3.5 text-base font-normal text-foreground outline-none focus:border-foreground";
const label = "grid gap-1.5 text-sm font-semibold";
const btn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-foreground px-5 font-semibold text-paper disabled:opacity-50";

/** The super admin: sign in, upload reels, add and remove reviews. */
export function AdminApp() {
  const [state, setState] = useState<"loading" | "out" | "in">("loading");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("/api/admin/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { admin?: boolean; email?: string | null }) => {
        setEmail(d.email ?? "");
        setState(d.admin ? "in" : "out");
      })
      .catch(() => setState("out"));
  }, []);

  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-5 py-8 md:py-12">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3" aria-label="Back to the site">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-9m.jpg" alt="" width={44} height={44} className="size-11 rounded-xl" />
            <span className="font-brand leading-none">
              <span className="block text-[1.35rem] font-black">9M</span>
              <span className="block text-[0.66rem] font-semibold tracking-[0.16em]">ADMIN</span>
            </span>
          </a>
          {state === "in" ? (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">{email}</span>
              <button
                type="button"
                onClick={async () => {
                  await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
                  setState("out");
                }}
                className="inline-flex min-h-10 items-center gap-2 rounded-full px-4 font-semibold ring-[1.5px] ring-current ring-inset"
              >
                <LogOut className="size-4" /> Sign out
              </button>
            </div>
          ) : null}
        </header>

        {state === "loading" ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : state === "out" ? (
          <Login
            onIn={(e) => {
              setEmail(e);
              setState("in");
            }}
          />
        ) : (
          <Dashboard />
        )}
      </div>
    </div>
  );
}

function Login({ onIn }: { onIn: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const d = (await r.json().catch(() => ({}))) as { email?: string; error?: string };
      if (r.ok) onIn(d.email ?? email);
      else setError(d.error ?? "Could not sign in.");
    } catch {
      setError("Could not reach the server.");
    }
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="mx-auto mt-10 grid max-w-sm gap-4 rounded-[16px] bg-paper p-7">
      <h1 className="display text-[2.2rem]">Super admin</h1>
      <p className="text-muted-foreground">Sign in to upload reels and add reviews.</p>
      <label className={label}>
        Email
        <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
      </label>
      <label className={label}>
        Password
        <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
      </label>
      {error ? (
        <p role="alert" className="text-sm font-semibold text-destructive">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={busy} className={btn}>
        {busy ? <Loader2 className="size-4 animate-spin" /> : null}
        Sign in
      </button>
    </form>
  );
}

function Dashboard() {
  const [tab, setTab] = useState<"reels" | "reviews">("reels");
  return (
    <div>
      <div role="tablist" aria-label="Manage" className="mb-7 inline-flex gap-1 rounded-full bg-secondary p-1">
        {(["reels", "reviews"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn("min-h-10 rounded-full px-5 font-semibold capitalize transition-colors", tab === t ? "bg-foreground text-paper" : "text-muted-foreground")}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "reels" ? <ReelsPanel /> : <ReviewsPanel />}
      <p className="mt-12 text-sm text-muted-foreground">Uploads are saved on this server (the data folder) and show on the site straight away.</p>
    </div>
  );
}

function ReelsPanel() {
  const form = useRef<HTMLFormElement>(null);
  const [list, setList] = useState<Reel[]>([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => {
    fetch("/api/reels", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: unknown) => setList(Array.isArray(d) ? (d as Reel[]) : []))
      .catch(() => {});
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const upload = (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setMsg("");
    setProgress(0);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/reels");
    xhr.setRequestHeader("Content-Type", file.type || "video/mp4");
    xhr.setRequestHeader("x-title", encodeURIComponent(title.trim() || file.name.replace(/\.[^.]+$/, "")));
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100));
    };
    xhr.onload = () => {
      setProgress(null);
      if (xhr.status === 201) {
        setMsg("Uploaded. It is live in the Reels section.");
        setTitle("");
        setFile(null);
        form.current?.reset();
        load();
      } else {
        try {
          setMsg((JSON.parse(xhr.responseText) as { error?: string }).error ?? "Upload failed.");
        } catch {
          setMsg("Upload failed.");
        }
      }
    };
    xhr.onerror = () => {
      setProgress(null);
      setMsg("Upload failed. Check the connection and try again.");
    };
    xhr.send(file);
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this reel from the site?")) return;
    await fetch(`/api/admin/reels?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="grid gap-8">
      <form ref={form} onSubmit={upload} className="grid gap-4 rounded-[16px] bg-paper p-6 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label className={label}>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Ceramic coating on a Creta" maxLength={80} className={input} />
        </label>
        <label className={label}>
          Video (MP4 or MOV, up to 300 MB)
          <input type="file" accept="video/mp4,video/quicktime,video/webm" required onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm font-normal file:mr-3 file:min-h-10 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:font-semibold" />
        </label>
        <button type="submit" disabled={!file || progress !== null} className={btn}>
          {progress !== null ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          {progress !== null ? `${progress}%` : "Upload reel"}
        </button>
        {progress !== null ? (
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary md:col-span-3">
            <div className="h-full bg-foreground transition-[width]" style={{ width: `${progress}%` }} />
          </div>
        ) : null}
        {msg ? (
          <p role="status" className="text-sm font-semibold md:col-span-3">
            {msg}
          </p>
        ) : null}
      </form>

      <div>
        <h2 className="display mb-4 text-[1.8rem]">Uploaded reels</h2>
        {list.length === 0 ? (
          <p className="text-muted-foreground">No reels uploaded yet. The site shows its sample reels until you add one.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {list.map((r) => (
              <li key={r.id} className="overflow-hidden rounded-[12px] bg-paper">
                <video src={r.src} muted playsInline preload="metadata" controls className="aspect-[9/16] w-full bg-black object-cover" />
                <div className="flex items-start justify-between gap-2 p-3">
                  <span className="text-sm leading-snug font-semibold">{r.title}</span>
                  <button type="button" onClick={() => remove(r.id)} aria-label={`Delete ${r.title}`} className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-secondary">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ReviewsPanel() {
  const form = useRef<HTMLFormElement>(null);
  const [list, setList] = useState<ReviewRow[]>([]);
  const [rating, setRating] = useState(5);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(() => {
    fetch("/api/reviews", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: unknown) => setList(Array.isArray(d) ? (d as ReviewRow[]) : []))
      .catch(() => {});
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    data.set("rating", String(rating));
    setBusy(true);
    setMsg("");
    try {
      const r = await fetch("/api/admin/reviews", { method: "POST", body: data });
      const d = (await r.json().catch(() => ({}))) as { error?: string };
      if (r.ok) {
        setMsg("Added. It is first in the reviews row now.");
        form.current?.reset();
        setRating(5);
        load();
      } else setMsg(d.error ?? "Could not add the review.");
    } catch {
      setMsg("Could not reach the server.");
    }
    setBusy(false);
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this review from the site?")) return;
    await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="grid gap-8">
      <form ref={form} onSubmit={submit} className="grid gap-4 rounded-[16px] bg-paper p-6 md:grid-cols-2">
        <label className={label}>
          Owner&apos;s name
          <input name="name" required maxLength={60} placeholder="e.g. Rohit K." className={input} />
        </label>
        <label className={label}>
          Car
          <input name="car" required maxLength={60} placeholder="e.g. Tata Curvv" className={input} />
        </label>
        <label className={label}>
          Service
          <select name="service" required defaultValue="" className={input}>
            <option value="" disabled>
              Choose a service
            </option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <div className={label}>
          Stars
          <div className="flex h-11 items-center gap-1" role="radiogroup" aria-label="Stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => setRating(n)} className="p-1">
                <Star className={cn("size-6", n <= rating ? "fill-current" : "opacity-30")} />
              </button>
            ))}
          </div>
        </div>
        <label className={cn(label, "md:col-span-2")}>
          What they said
          <textarea name="text" required maxLength={400} rows={3} placeholder="Paste the review, in the owner's words." className={cn(input, "h-auto py-3")} />
        </label>
        <label className={cn(label, "md:col-span-2")}>
          Photo of the car (JPG, PNG or WebP)
          <input name="photo" type="file" accept="image/jpeg,image/png,image/webp" required className="text-sm font-normal file:mr-3 file:min-h-10 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:font-semibold" />
        </label>
        <div className="flex flex-wrap items-center gap-4 md:col-span-2">
          <button type="submit" disabled={busy} className={btn}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}
            Add review
          </button>
          {msg ? (
            <p role="status" className="text-sm font-semibold">
              {msg}
            </p>
          ) : null}
        </div>
      </form>

      <div>
        <h2 className="display mb-4 text-[1.8rem]">Added reviews</h2>
        {list.length === 0 ? (
          <p className="text-muted-foreground">No reviews added yet. The site shows its placeholder reviews until you add real ones.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {list.map((r) => (
              <li key={r.id} className="flex gap-4 rounded-[12px] bg-paper p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.photo.src} alt="" className="size-20 shrink-0 rounded-[8px] object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    {r.name} <span className="font-normal text-muted-foreground">· {r.car}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {r.service} · {"★".repeat(r.rating)}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm">{r.text}</p>
                </div>
                <button type="button" onClick={() => remove(r.id)} aria-label={`Delete the review from ${r.name}`} className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-secondary">
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
