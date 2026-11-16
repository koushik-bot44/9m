import { NAV, SITE, wa } from "@/lib/site";

const SERVICE_LIST = ["Paint protection film", "Ceramic coating", "Graphene coating", "Teflon coating", "Interior and exterior deep clean", "Underbody coating", "Servicing and repairs"];
const head = "mb-4 text-sm font-semibold text-white/50";
const item = "block py-1 text-[0.98rem] text-white/85 transition-colors hover:text-white";

/** A black card on the ground at the very bottom: every detail, and the 9M wordmark across the foot. */
export function Footer() {
  return (
    <footer className="gut relative pt-2 pb-[clamp(14px,2vw,26px)] max-md:pb-24">
      <div className="overflow-hidden rounded-[18px] bg-[#0b0b0c] text-[#f3efe8]">
        <div className="grid gap-10 px-[clamp(22px,4vw,64px)] pt-[clamp(36px,5vw,72px)] md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-9m.jpg" alt="9M Car Care logo" width={52} height={52} className="size-[52px] rounded-xl" />
              <span className="font-brand leading-none">
                <span className="block text-[1.7rem] font-black">9M</span>
                <span className="block text-[0.72rem] font-semibold tracking-[0.16em]">CAR CARE</span>
              </span>
            </div>
            <p className="mt-6 max-w-sm text-[clamp(1.3rem,1.8vw,1.7rem)] leading-tight font-semibold">{SITE.tagline}</p>
            <p className="mt-3 max-w-sm leading-relaxed text-white/60">Premium detailing studio in KPHB, Hyderabad: detailing, paint protection, deep cleaning, servicing and repairs.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href={wa()} target="_blank" rel="noopener" className="rounded-full bg-[#f3efe8] px-5 py-2.5 font-semibold text-[#0b0b0c]">
                WhatsApp
              </a>
              <a href={`tel:${SITE.phones[0].tel}`} className="rounded-full px-5 py-2.5 font-semibold ring-1 ring-white/30 ring-inset hover:bg-white/10">
                Call
              </a>
              <a href={SITE.instagram} target="_blank" rel="noopener" className="rounded-full px-5 py-2.5 font-semibold ring-1 ring-white/30 ring-inset hover:bg-white/10">
                Instagram
              </a>
            </div>
          </div>

          <nav aria-label="Footer" className="md:col-span-2">
            <h3 className={head}>Explore</h3>
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className={item}>
                {n.label}
              </a>
            ))}
            <a href="#top" className={item}>
              Back to top
            </a>
          </nav>

          <div className="md:col-span-2">
            <h3 className={head}>Services</h3>
            {SERVICE_LIST.map((s) => (
              <a key={s} href="#services" className={item}>
                {s}
              </a>
            ))}
          </div>

          <div className="md:col-span-3">
            <h3 className={head}>Contact</h3>
            {SITE.phones.map((p) => (
              <a key={p.tel} href={`tel:${p.tel}`} className={item}>
                +91 {p.label}
              </a>
            ))}
            <a href={SITE.instagram} target="_blank" rel="noopener" className={item}>
              {SITE.instagramHandle}
            </a>
            <a href={`https://${SITE.domain}`} className={item}>
              {SITE.domain}
            </a>
            <a href={SITE.maps} target="_blank" rel="noopener" className={`${item} mt-2 leading-snug`}>
              {SITE.address.join(", ")}
            </a>
          </div>
        </div>

        <div className="mx-[clamp(22px,4vw,64px)] mt-12 flex flex-wrap justify-between gap-3 border-t border-white/10 py-5 text-sm text-white/50">
          <p>© 2026 9M Car Care. All rights reserved.</p>
          <p>Photographs: 9M Car Care and Pexels.</p>
          <a href="/privacy" className="underline-offset-4 hover:text-white hover:underline">
            Privacy
          </a>
        </div>

        <div
          aria-hidden
          className="-mb-[0.08em] px-[clamp(8px,1.6vw,24px)] text-center font-brand text-[11.4vw] leading-[0.8] font-black tracking-[-0.025em] whitespace-nowrap text-white [mask-image:linear-gradient(to_bottom,#000_25%,transparent_96%)]"
        >
          9M CAR CARE
        </div>
      </div>
    </footer>
  );
}
