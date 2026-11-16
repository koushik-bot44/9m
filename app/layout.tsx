import type { Metadata, Viewport } from "next";
import { brand, fraunces, instrument, sign } from "@/lib/fonts";
import { DESCRIPTION, SITE_URL, TITLE } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | 9M Car Care" },
  description: DESCRIPTION,
  applicationName: "9M Car Care",
  openGraph: { type: "website", locale: "en_IN", siteName: "9M Car Care", title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  // Search Console: paste the HTML-tag code into GOOGLE_SITE_VERIFICATION before the production build
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  formatDetection: { telephone: true, address: true },
  category: "automotive",
};

export const viewport: Viewport = { themeColor: "#ebe6de" };

// Puts the visitor's last sky (day, pink dusk or night) back before the first paint.
const MOOD = `try{var m=localStorage.getItem("9m-mood");if(m==="dusk"||m==="night")document.documentElement.setAttribute("data-mood",m)}catch(e){}`;

// Google Analytics 4 runs only when the owner sets NEXT_PUBLIC_GA_ID. It records taps on WhatsApp, call,
// directions and Instagram links and enquiry-form sends as events, and its script loads with the late assets.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const ANALYTICS = GA_ID
  ? `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config",${JSON.stringify(GA_ID)});` +
    `document.addEventListener("click",function(v){var a=v.target&&v.target.closest&&v.target.closest("a[href]");if(!a)return;var h=a.getAttribute("href")||"",n=/wa\\.me|whatsapp/.test(h)?"whatsapp_click":/^tel:/.test(h)?"call_click":/maps\\.app\\.goo\\.gl|google\\.[a-z.]+\\/maps/.test(h)?"directions_click":/instagram\\.com/.test(h)?"instagram_click":"";if(n)gtag("event",n,{link_url:h})},true);` +
    `document.addEventListener("submit",function(){gtag("event","enquiry_submit")},true);`
  : "";
const LOAD_GA = GA_ID
  ? `var s=document.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtag/js?id="+${JSON.stringify(encodeURIComponent(GA_ID))};document.head.appendChild(s);`
  : "";

// The heading and signature fonts (about 280 KB) and the faint toy-car background are only seen below the first
// screen. They start downloading on the visitor's first scroll, tap or key, or 2 s after the page has loaded,
// so on a phone the hero photo and the 9M lettering get the connection to themselves.
const LATE_CLASSES = [fraunces.variable, sign.variable, "late"];
const LATE = `(function(){var d=document.documentElement,e=["scroll","wheel","pointerdown","touchstart","keydown"],done=0;function go(){if(done)return;done=1;d.classList.add.apply(d.classList,${JSON.stringify(LATE_CLASSES)});${LOAD_GA}e.forEach(function(n){removeEventListener(n,go,true)})}e.forEach(function(n){addEventListener(n,go,{capture:true,passive:true})});function later(){setTimeout(go,2000)}if(document.readyState==="complete")later();else addEventListener("load",later,{once:true})})()`;
// Without JavaScript nothing waits.
const NOSCRIPT = `:root{--font-fraunces:${fraunces.style.fontFamily};--font-sign:${sign.style.fontFamily}}.site-bg{background-image:var(--site-bg)}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" data-mood="day" suppressHydrationWarning className={`${instrument.variable} ${brand.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOOD + ANALYTICS + LATE }} />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: NOSCRIPT }} />
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
