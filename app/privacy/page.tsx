import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How the 9M Car Care website handles your information: enquiries go through WhatsApp, the site keeps one display setting, and the map comes from Google.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "16 November 2026";
const ANALYTICS = Boolean(process.env.NEXT_PUBLIC_GA_ID);

const h2 = "font-brand text-[1.25rem] font-black tracking-[-0.01em]";

export default function Privacy() {
  return (
    <main className="gut mx-auto max-w-[46rem] py-[clamp(48px,10svh,120px)]">
      <Link href="/" className="font-brand text-[1.4rem] font-black tracking-[-0.02em]">
        9M <span className="text-[0.5em] font-semibold tracking-[0.2em]">CAR CARE</span>
      </Link>
      <h1 className="mt-12 font-brand text-[clamp(2.4rem,6vw,4rem)] leading-[0.95] font-black tracking-[-0.03em]">Privacy</h1>
      <p className="mt-3 text-sm text-foreground/70">Last updated {UPDATED}</p>

      <div className="mt-10 space-y-9 text-[1.05rem] leading-relaxed [&_p]:mt-2 [&_p]:max-w-[65ch]">
        <section>
          <h2 className={h2}>Who we are</h2>
          <p>
            {SITE.name}, {SITE.address.join(", ")}. Phone {SITE.phones.map((p) => p.label).join(" or ")}.
          </p>
        </section>
        <section>
          <h2 className={h2}>Enquiries</h2>
          <p>
            The enquiry form does not send anything to us or store anything on this website. When you press send, it opens
            WhatsApp with your message written in, and you decide whether to send it. From there WhatsApp&apos;s own privacy
            policy applies. Calls and messages reach us directly.
          </p>
        </section>
        <section>
          <h2 className={h2}>What your browser keeps</h2>
          <p>
            The site remembers one setting in your browser: the sky you picked (day, dusk or night). It sets no advertising
            cookies.
            {ANALYTICS &&
              " We use Google Analytics to count visits and which buttons are used, such as WhatsApp or Call. It sets cookies, and Google processes that data under its own privacy policy."}
          </p>
        </section>
        <section>
          <h2 className={h2}>The map</h2>
          <p>The map on the home page is embedded from Google Maps. Google may set cookies and see your IP address when it loads.</p>
        </section>
        <section>
          <h2 className={h2}>Questions</h2>
          <p>
            To ask about anything you have sent us, or to have it deleted, message us on WhatsApp at {SITE.phones[0].label} or
            call {SITE.phones[1].label}.
          </p>
        </section>
      </div>

      <Link href="/" className="mt-14 inline-block font-semibold underline underline-offset-4">
        Back to the home page
      </Link>
    </main>
  );
}
