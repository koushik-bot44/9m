import type { Metadata, Viewport } from "next";
import { brand, fraunces, instrument, sign } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://9mcarcare.com"),
  title: "9M Car Care, Hyderabad | Detailing, PPF, ceramic coating, servicing",
  description:
    "9M Car Care is a car care studio in KPHB, Hyderabad for detailing, paint protection film, ceramic coating, deep cleaning, servicing and repairs. Enquire on WhatsApp.",
  icons: { icon: "/logo-9m.jpg" },
};

export const viewport: Viewport = { themeColor: "#ebe6de" };

// Puts the visitor's last sky (day, pink dusk or night) back before the first paint.
const MOOD = `try{var m=localStorage.getItem("9m-mood");if(m==="dusk"||m==="night")document.documentElement.setAttribute("data-mood",m)}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-mood="day" suppressHydrationWarning className={`${fraunces.variable} ${instrument.variable} ${brand.variable} ${sign.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOOD }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
