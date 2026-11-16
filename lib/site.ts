// Everything about 9M that the page needs, in one place.
// Review photos are 9M's own (Instagram). Review text is a placeholder until real Google reviews are added
// from /admin. Other photographs are from Pexels, and no photograph is used in two places.

export const SITE = {
  name: "9M Car Care",
  tagline: "We detail. We protect. You drive happy.",
  domain: "9mcarcare.com",
  place: "KPHB, Hyderabad",
  address: ["LIG-108, 15th Phase, near Kaithalapur Junction (new flyover)", "KPHB Colony, Kukatpally, Hyderabad, Telangana 500085"],
  phones: [
    { label: "87902 33253", tel: "+918790233253" },
    { label: "81215 15191", tel: "+918121515191" },
  ],
  whatsapp: "918790233253",
  instagram: "https://www.instagram.com/9mcarcare/",
  instagramHandle: "@9mcarcare",
  maps: "https://maps.app.goo.gl/QpeDdNyNsrMCTbz49",
  mapEmbed: "https://maps.google.com/maps?q=9M%20Car%20Care%2C%20KPHB%20Colony%2C%20Hyderabad&z=16&output=embed",
  // Opens Google's "write a review" box for the 9M listing (built from the listing's map id).
  googleReview: "https://www.google.com/maps/place//data=!4m3!3m2!1s0x3bcb9145fbdf479f:0x6922675ee967d4c2!12e1",
};

/** Every enquiry on the site goes to WhatsApp with the message already written. */
export function wa(message = "Hi 9M Car Care. I'd like to ask about my car.") {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const NAV = [
  { label: "Reviews", href: "#reviews" },
  { label: "Services", href: "#services" },
  { label: "Reels", href: "#reels" },
  { label: "Questions", href: "#faq" },
  { label: "Visit", href: "#visit" },
];

export type Photo = { src: string; alt: string };
const p = (src: string, alt: string): Photo => ({ src: `/media/${src}`, alt });
const px = (id: number, alt: string): Photo => ({ src: `/media/px/${id}.jpg`, alt });

export const PHOTOS = {
  hero: p("mustang/hero.jpg", "The back of a classic Ford Mustang with white racing stripes and a chrome fuel cap"),
  mustangFront: p("mustang/front.jpg", "The front of a classic Mustang with white racing stripes"),
  mustangInterior: p("mustang/interior.jpg", "The dashboard and steering wheel of a classic Mustang"),
};

// The curved row under the Services heading: 24 different cars, one photo each (Pexels), brands and colours
// alternating. None of these photos appear anywhere else on the site.
const c = (id: number, alt: string): Photo => ({ src: `/media/band/car-${id}.jpg`, alt });
export const BAND: Photo[] = [
  c(20186655, "A green Mercedes-AMG GT R"),
  c(337909, "A red Ferrari 458"),
  c(16555016, "A white BMW M4 from behind"),
  c(18413128, "A gold Lamborghini Huracán STO"),
  c(13512047, "A black Range Rover on a mountain road"),
  c(17377925, "An orange McLaren 720S from behind"),
  c(3007436, "A silver Audi R8"),
  c(9890945, "A vintage Bentley S3"),
  c(13980813, "A black Lamborghini at sunset"),
  c(17623961, "A red Mercedes-AMG GT with its doors open"),
  c(3954783, "A white classic Porsche 911"),
  c(15446647, "A black Mercedes G-Class"),
  c(10889194, "A red Ferrari 488 Pista"),
  c(17145765, "A blue Audi R8"),
  c(5031675, "A white Dodge Viper with a rear wing"),
  c(4062463, "A white Bentley Arnage"),
  c(29460461, "A red BMW M4 among autumn trees"),
  c(11558251, "A black Range Rover Sport on the move"),
  c(14317468, "A red Ferrari SF90 on the road"),
  c(17476943, "A blue Mercedes-AMG GT"),
  c(11913353, "A black Lamborghini on the road"),
  c(1402787, "A dark Audi R8 under trees"),
  c(17377381, "An orange McLaren 720S in the rain"),
  c(11629361, "A red Ferrari Portofino"),
];

export type Service = {
  key: string;
  name: string;
  sub: string;
  query: string;
  mat: string;
  line: string;
  points: string[];
  photos: [Photo, Photo, Photo];
};

// 9M's own service names, from their Instagram posters.
export const SERVICES: Service[] = [
  {
    key: "detailing",
    name: "Detailing",
    sub: "Correction and finish",
    query: "paint correction",
    mat: "#c7d2cb",
    line: "Paint that looks dull is usually just scratched. We wash, decontaminate and machine polish in stages until the reflection is sharp again.",
    points: ["Foam wash", "Clay and decontamination", "Machine polish", "Paint correction", "Headlight restoration"],
    photos: [
      px(5233259, "A detailer machine polishing the bonnet of a black car"),
      px(5233278, "A yellow polishing pad on a white bonnet"),
      px(5233274, "The tail lamp of a freshly polished white car"),
    ],
  },
  {
    key: "protection",
    name: "Paint protection",
    sub: "PPF, ceramic, graphene, Teflon",
    query: "ppf and ceramic coating",
    mat: "#2b343c",
    line: "Film takes the stone chips. Ceramic and graphene hold the gloss and make washing easy, and Teflon is the quick shine. We tell you plainly which suits your car.",
    points: ["Paint protection film", "Ceramic coating", "Graphene coating", "Teflon coating", "Underbody coating"],
    photos: [
      px(10126665, "A technician laying protection film over a white bonnet"),
      px(20051468, "Film being squeegeed onto a sports car bonnet"),
      px(5233268, "A coating being wiped onto a white bonnet with a blue cloth"),
    ],
  },
  {
    key: "cleaning",
    name: "Deep cleaning",
    sub: "Inside and out",
    query: "interior deep clean",
    mat: "#e2d4bf",
    line: "A full body wash for the outside, and the slow work inside: seats, carpets, roof lining, vents and every seam a quick wash skips.",
    points: ["Interior deep clean", "Exterior deep clean", "Full body wash", "Seats and carpets", "Roof lining and vents"],
    photos: [
      px(5233285, "A vacuum nozzle cleaning a fabric car seat"),
      px(5233264, "An extractor lifting dirt out of car carpet"),
      px(6873121, "A black car covered in wash foam"),
    ],
  },
  {
    key: "servicing",
    name: "Servicing and repairs",
    sub: "Mechanical and body",
    query: "servicing and repairs",
    mat: "#6a3a2c",
    line: "The mechanical side lives in the same studio, so a service, a brake job or a dent does not mean a second trip somewhere else.",
    points: ["Periodic service", "Diagnostics", "Brakes and suspension", "Denting and painting"],
    photos: [
      px(27665740, "Hands turning a wrench on an engine"),
      px(8985455, "A mechanic working in an open engine bay"),
      px(8986047, "Gloved hands on a cylinder head"),
    ],
  },
];

export type Clip = { src: string; poster: string; label: string; alt: string; text: string };
const bay = (id: number, label: string, alt: string, text: string): Clip => ({ src: `/media/bay/${id}.mp4`, poster: `/media/bay/${id}.jpg`, label, alt, text });

// "Inside the bay": short films (Pexels). When one ends, the next rises over it, the Cosmos way. Used nowhere else.
export const BAY: Clip[] = [
  bay(6157906, "Machine polish", "A detailer machine polishing a car", "Two passes with the polisher, checked under light between each, until the swirls are gone."),
  bay(6157781, "Gloss check", "Light moving across freshly polished paint", "Light is pulled across every panel to find what the eye misses, before anything is sealed in."),
  bay(6158073, "Interior detailing", "A detailer cleaning a car interior", "Brushes and extraction for the vents, seams and stitching that a quick wash skips."),
  bay(6158068, "Service bay", "A mechanic working on a car in the workshop", "Servicing and repairs happen in the same studio, so the car never needs a second trip."),
  bay(4849127, "Hand wash", "A car being washed by hand", "Every job starts with a careful hand wash. Nothing gets polished or coated over dirt."),
];

export type TunnelCard = Photo & { title: string };
const t = (src: string, alt: string, title: string): TunnelCard => ({ src: `/media/${src}`, alt, title });

// "Seen up close": badges, scripts and grilles of big cars and sports cars (Pexels). Used nowhere else.
const badge = (id: number, alt: string, title: string): TunnelCard => t(`badges/${id}.jpg`, alt, title);
export const TUNNEL: TunnelCard[] = [
  badge(10247967, "The BMW roundel on a wet blue bonnet", "BMW"),
  badge(12418665, "The four Audi rings on a wet bonnet", "Audi"),
  badge(34523602, "The Ferrari prancing horse on a red bonnet", "Ferrari"),
  badge(19782034, "The Mercedes-Benz star on a wet black bonnet", "Mercedes-Benz"),
  badge(10493497, "The Lamborghini bull on a wet bonnet", "Lamborghini"),
  badge(9427659, "The front of a red Range Rover at night", "Range Rover"),
  badge(8190581, "The M badge on the boot of a blue BMW", "BMW M"),
  badge(6166025, "The headlamp and bonnet of a Porsche 911", "Porsche 911"),
  badge(9714372, "The Audi SQ5 grille badge", "Audi SQ5"),
  badge(30360696, "A V8 Biturbo badge on a black wing", "AMG V8 Biturbo"),
  badge(33056818, "The BMW roundel on a green bonnet", "BMW"),
  badge(29527916, "The Lamborghini script on a black grille", "Lamborghini"),
];

export type Review = { id: string; name: string; sign: string; car: string; service: string; rating: number; text: string; photo: Photo };
const ig = (n: number, alt: string): Photo => ({ src: `/media/ig/car-${n}.jpg`, alt });

// Photos: real customer cars from 9M's Instagram. Text: placeholder until real Google reviews are added in /admin.
export const REVIEWS: Review[] = [
  { id: "r1", name: "Rahul K.", sign: "Rahul", car: "Tata Curvv", service: "Ceramic coating", rating: 5, photo: ig(1, "A white Tata Curvv in the 9M studio"), text: "Got ceramic coating on my new Curvv. The gloss is unreal and water just slides off. Good detailing, and they explained every step." },
  { id: "r2", name: "Sandeep R.", sign: "Sandeep", car: "Hyundai Elantra", service: "Paint correction", rating: 5, photo: ig(2, "A black Hyundai sedan in the 9M studio"), text: "My black car had swirl marks everywhere. After the polish it looks like a mirror. Very neat work." },
  { id: "r3", name: "Meghana P.", sign: "Meghana", car: "Kia Syros", service: "PPF", rating: 5, photo: ig(3, "A white Kia Syros in the 9M studio"), text: "PPF on the full front of my Syros. The edges are wrapped clean and you can't even tell the film is there." },
  { id: "r4", name: "Venkat Rao", sign: "Venkat", car: "Toyota Innova Crysta", service: "Interior deep clean", rating: 5, photo: ig(4, "A white Toyota Innova Crysta in the 9M studio"), text: "Family car, seven seats, lots of stains. The interior came back like new and smelled fresh. Good detailing at a fair price." },
  { id: "r5", name: "Karthik M.", sign: "Karthik", car: "Mahindra XUV 3XO", service: "Graphene coating", rating: 5, photo: ig(5, "A blue Mahindra XUV 3XO in the 9M studio"), text: "Went for graphene coating on the 3XO. Deep shine on the blue, and washing is so easy now." },
  { id: "r6", name: "Anusha S.", sign: "Anusha", car: "Hyundai Creta", service: "Teflon coating", rating: 5, photo: ig(6, "A blue Hyundai SUV in the 9M studio"), text: "Teflon coating and interior cleaning in one day. Quick WhatsApp reply and the car was ready on time." },
  { id: "r7", name: "Imran A.", sign: "Imran", car: "Mercedes-Benz ML", service: "Full detailing", rating: 5, photo: ig(7, "A black Mercedes-Benz ML in the 9M studio"), text: "An older ML, but after the full detail it looks showroom fresh. They treat the car like their own." },
  { id: "r8", name: "Pranav Reddy", sign: "Pranav", car: "Tata Harrier", service: "Underbody coating", rating: 5, photo: ig(8, "A white Tata SUV in the 9M studio"), text: "Underbody coating before the rains, plus a full body wash. Proper job, and they showed me photos of the underside." },
];

// The film section switches between these (driving films, used nowhere else).
export const FILMS = [
  { src: "/media/video/film.mp4", poster: "/media/video/film.jpg", label: "Mountain road" },
  { src: "/media/video/film-2.mp4", poster: "/media/video/film-2.jpg", label: "Gravel track" },
  { src: "/media/video/film-3.mp4", poster: "/media/video/film-3.jpg", label: "Golden hour" },
];

export type Reel = { id: string; title: string; src: string; poster?: string };

const reel = (id: number, title: string): Reel => ({ id: `px-${id}`, title, src: `/media/reels/${id}.mp4`, poster: `/media/reels/${id}.jpg` });

// Vertical clips from one detailing studio (Pexels). Reels 9M uploads in /admin appear in front of these.
export const DEFAULT_REELS: Reel[] = [
  reel(32010529, "Pre-wash rinse"),
  reel(32010531, "Foam and a soft mitt"),
  reel(32010538, "Badges and grille, by brush"),
  reel(32010533, "Carpets scrubbed, then extracted"),
  reel(32010530, "Wheels and arches"),
  reel(32010536, "Interior wipe-down"),
  reel(32010527, "Doors, shuts and seals"),
  reel(32010532, "Mats out, one by one"),
];

export const FAQS = [
  {
    q: "What does ceramic coating actually do?",
    a: "It bonds a hard, glassy layer to the clear coat. You get deeper gloss, water and dirt slide off, and the car is far easier to wash. It does not stop stone chips: that is what film is for.",
  },
  {
    q: "What is PPF, and which panels need it?",
    a: "Paint protection film is a clear urethane film, roughly 150 to 200 microns thick, that takes stone chips and light scratches instead of your paint. Most owners film the panels that face the road: bonnet, front bumper, mirrors and sills. Full-body film is an option too.",
  },
  {
    q: "Ceramic, graphene or Teflon: which should I pick?",
    a: "Teflon is a polymer sealant: quick, affordable and good for a fresh shine, but it lasts the shortest. Ceramic is harder and lasts much longer. Graphene adds graphene to the coating for extra slickness and fewer water spots. We recommend one for your car and how you use it.",
  },
  {
    q: "How long will my car be with you?",
    a: "A wash or a Teflon coat is usually the same day. Paint correction, ceramic, graphene and PPF take longer, because the paint is corrected first and the coating has to cure. We confirm the time when you book.",
  },
  {
    q: "Do you work on every kind of car?",
    a: "Hatchbacks, sedans, SUVs and luxury cars, new or old. The price depends on the size of the car and the work it needs.",
  },
  {
    q: "How do I book?",
    a: "Message us on WhatsApp at 87902 33253 or call 81215 15191. Tell us the car and what it needs, and we reply with a time.",
  },
];
