# 9m

Website for 9M Car Care, KPHB, Hyderabad (9mcarcare.com). Next.js 16, Tailwind 4, framer-motion.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```

## Admin (reels and reviews)

The super admin lives at `/admin`. Create `.env.local` (it is never committed) with:

```
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=a-long-password
SESSION_SECRET=at-least-32-random-characters
```

Uploaded reels and review photos are saved in `./data` (also not committed), so the host needs a persistent disk. Set `DATA_DIR` to put them somewhere else.
