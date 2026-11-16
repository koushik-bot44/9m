import PerspectiveTunnelHero from "@/components/ui/perspective-tunnel-hero";
import { SITE, TUNNEL } from "@/lib/site";
import { Pill } from "./pill";

/** Recent work, flown through with the scroll: the tunnel from 21st.dev. */
export function Work() {
  return (
    <section id="work" aria-label="Work">
      <PerspectiveTunnelHero images={TUNNEL} title={<>Seen up <em>close.</em></>} subtitle="Badges, scripts and grilles: the details that show every swirl. Scroll to fly through." length={4} />
      <div className="gut flex flex-col items-center gap-4 pb-[clamp(56px,8vw,120px)] text-center">
        <p className="max-w-md text-muted-foreground">BMW, Audi, Mercedes-Benz, Range Rover, Porsche, Lamborghini and Ferrari. Sample photographs (Pexels).</p>
        <Pill href={SITE.instagram} external tone="line">
          See more on Instagram
        </Pill>
      </div>
    </section>
  );
}
