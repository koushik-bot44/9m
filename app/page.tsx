import { BayWall } from "@/components/site/bay-wall";
import { Fab, Grain, Tiny } from "@/components/site/extras";
import { Faq } from "@/components/site/faq";
import { Film } from "@/components/site/film";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Micron } from "@/components/site/micron";
import { Outro } from "@/components/site/outro";
import { Reels } from "@/components/site/reels";
import { Reviews } from "@/components/site/reviews";
import { Services } from "@/components/site/services";
import { Work } from "@/components/site/work";

export default function Page() {
  return (
    <>
      {/* the site's background: toy cars, kept very light */}
      <div aria-hidden className="site-bg" style={{ backgroundImage: "url(/media/bg/toy-cars.jpg)" }} />
      <Header />
      <main>
        <Hero />
        <Reviews />
        <Services />
        <BayWall />
        <Film />
        <Reels />
        <Work />
        <Micron />
        <Faq />
        <Tiny />
        <Outro />
      </main>
      <Fab />
      <Grain />
    </>
  );
}
