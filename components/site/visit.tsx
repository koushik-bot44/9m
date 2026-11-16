"use client";

import { useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { SITE, wa } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Pill, WaPill } from "./pill";

const NEEDS = ["PPF", "Ceramic coating", "Graphene coating", "Teflon coating", "Deep cleaning", "Detailing", "Servicing and repairs", "Not sure yet"];
const join = (a: string[]) => (a.length < 2 ? a.join("") : `${a.slice(0, -1).join(", ")} and ${a[a.length - 1]}`);

function Row({ k, children }: { k: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 border-t border-border pt-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  );
}

/** The enquiry (pick what the car needs and it opens WhatsApp with the message written), then where to find the studio. */
export function Visit() {
  const [needs, setNeeds] = useState<string[]>([]);
  const [car, setCar] = useState("");
  const [name, setName] = useState("");

  const asked = needs.filter((n) => n !== "Not sure yet");
  let message = "Hi 9M Car Care. ";
  if (asked.length) message += `I'd like to ask about ${join(asked.map((a) => (a === "PPF" ? "PPF" : a.toLowerCase())))}.`;
  else if (needs.length) message += "I'm not sure yet what my car needs and would like you to take a look.";
  else message += "I'd like to ask about my car.";
  if (car.trim()) message += ` Car: ${car.trim()}.`;
  if (name.trim()) message += ` Name: ${name.trim()}.`;
  message += " When can I bring it in?";

  const toggle = (n: string) => setNeeds((v) => (v.includes(n) ? v.filter((x) => x !== n) : [...v, n]));
  const link = "underline decoration-[1.5px] underline-offset-[3px]";

  return (
    <section id="visit" className="gut py-[clamp(96px,13vw,200px)]">
      <div className="grid items-end gap-[clamp(28px,6vw,110px)] md:grid-cols-[minmax(0,1fr)_minmax(0,30rem)]">
        <div>
          <h2 className="display text-[clamp(3.2rem,10.5vw,12rem)]">
            Bring your car <em>in.</em>
          </h2>
          <p className="mt-6 max-w-[28ch] text-[clamp(1.1rem,1.55vw,1.45rem)] leading-snug font-medium">Tell us the car and what it needs. We reply on WhatsApp with a time to visit.</p>
        </div>

        <form
          className="grid gap-4 rounded-[16px] bg-paper p-[clamp(18px,2.4vw,34px)]"
          onSubmit={(e) => {
            e.preventDefault();
            window.open(wa(message), "_blank", "noopener");
          }}
        >
          <fieldset className="min-w-0">
            <legend className="display mb-3.5 text-[1.6rem] font-extrabold">What does the car need?</legend>
            <div className="flex flex-wrap gap-1.5">
              {NEEDS.map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={needs.includes(n)}
                  onClick={() => toggle(n)}
                  className={cn("min-h-11 rounded-full px-4 text-[0.95rem] font-semibold transition-colors", needs.includes(n) ? "bg-foreground text-paper" : "bg-secondary hover:bg-secondary/70")}
                >
                  {n}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-semibold text-muted-foreground">
              Your car
              <input value={car} onChange={(e) => setCar(e.target.value)} placeholder="Make and model" autoComplete="off" className="h-12 rounded-[10px] border-[1.5px] border-input bg-transparent px-3.5 text-base font-medium text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground" />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-muted-foreground">
              Your name
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional" autoComplete="name" className="h-12 rounded-[10px] border-[1.5px] border-input bg-transparent px-3.5 text-base font-medium text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground" />
            </label>
          </div>
          <p className="min-h-[4.7em] rounded-[10px] bg-secondary px-4 py-3.5 text-[0.95rem] leading-snug text-muted-foreground" aria-live="polite">
            {message}
          </p>
          <button type="submit" className="group inline-flex min-h-[3.3rem] w-fit items-center gap-3 rounded-full bg-foreground py-1.5 pr-1.5 pl-6 font-semibold text-paper">
            Send on WhatsApp
            <span className="grid size-10 place-items-center rounded-full bg-paper text-foreground transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="size-4" strokeWidth={2.4} />
            </span>
          </button>
          <p className="text-[0.82rem] leading-snug text-muted-foreground">This opens WhatsApp with your message ready. It is an enquiry, and your slot is confirmed once 9M replies.</p>
        </form>
      </div>

      {/* find us: every detail, and the map */}
      <div className="mt-[clamp(44px,6vw,92px)] grid gap-4 md:grid-cols-[minmax(0,27rem)_minmax(0,1fr)]">
        <div className="rounded-[16px] bg-paper p-[clamp(20px,2.6vw,36px)]">
          <span className="inline-block rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-paper">Find us</span>
          <h3 className="display mt-4 text-[clamp(1.8rem,2.6vw,2.4rem)]">
            The studio in <em>KPHB.</em>
          </h3>
          <dl className="mt-5 grid gap-3 text-[0.96rem]">
            <Row k="Studio">9M Car Care, premium detailing studio</Row>
            <Row k="Address">
              {SITE.address.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </Row>
            <Row k="Phone">
              {SITE.phones.map((p) => (
                <a key={p.tel} href={`tel:${p.tel}`} className={cn("mr-3 inline-block", link)}>
                  {p.label}
                </a>
              ))}
            </Row>
            <Row k="Instagram">
              <a href={SITE.instagram} target="_blank" rel="noopener" className={link}>
                {SITE.instagramHandle}
              </a>
            </Row>
            <Row k="Website">{SITE.domain}</Row>
            <Row k="Hours">Message us on WhatsApp for today&apos;s timings</Row>
          </dl>
          <div className="mt-6 flex flex-wrap gap-2">
            <WaPill size="sm">Book on WhatsApp</WaPill>
            <Pill href={SITE.maps} external size="sm" tone="line">
              Open in Google Maps
            </Pill>
          </div>
        </div>
        <div className="relative min-h-[360px] overflow-hidden rounded-[16px] bg-paper">
          <iframe
            title="Map showing 9M Car Care in KPHB Colony, Hyderabad"
            src={SITE.mapEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="map-night absolute inset-0 size-full border-0"
          />
        </div>
      </div>
    </section>
  );
}
