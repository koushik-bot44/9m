import { Fraunces, Instrument_Sans, Montserrat, Mrs_Saint_Delafield } from "next/font/google";

// Display lettering: soft, heavy, with an italic accent word.
export const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

// Everything you read.
export const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument", display: "swap" });

// The 9M mark, drawn like the Instagram logo: very heavy round "9M", tracked "CAR CARE" under it.
export const brand = Montserrat({ subsets: ["latin"], weight: ["600", "900"], variable: "--font-montserrat", display: "swap" });

// Autographs on the review photos.
export const sign = Mrs_Saint_Delafield({ subsets: ["latin"], weight: "400", variable: "--font-sign", display: "swap" });
