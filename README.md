# Kinocut

A subscription edit bay. Clients send footage and get one finished video at a time, for a flat monthly fee. This repo is the marketing site: Next.js, Tailwind, Framer Motion, GSAP, and Lenis.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

Copy, prices, FAQs, and links live in [`content/site.ts`](content/site.ts). Colors and motion tokens live in [`app/globals.css`](app/globals.css). Keep [`content/tokens.ts`](content/tokens.ts) in sync with those colors. It is only used by the Open Graph image.

## Assets to replace

The page ships with placeholders so it runs before your masters exist.

### Hero video

| File | Spec |
| --- | --- |
| `public/videos/hero.mp4` | 1920×1080, 10–15s, seamless loop, H.264, no audio, under 4MB |
| `public/videos/hero.webm` | Same cut, VP9/WebM, under 4MB. Desktop source. |
| `public/videos/hero-mobile.mp4` | 1280×720, under 1.5MB. Used at 768px and below. |
| `public/videos/hero-poster.jpg` | 1920×1080 JPG. Shown before the first frame, and instead of video when `prefers-reduced-motion` or Save-Data is on. |

Current placeholder: a 12-second trim of [Pexels 3129671](https://videos.pexels.com/video-files/3129671/3129671-hd_1920_1080_30fps.mp4), compressed, upscaled, and hue-shifted toward brand blue. Pexels License. See `public/videos/SOURCE.txt`. Swap all four files and keep the same names. The markup is already wired in `components/HeroVideo.tsx`.

Recommended capture: a dim studio, a timeline, or slow hands-on-footage. Avoid bright skies. The hero lays a 60% ink wash, a bottom vignette, and a blue-to-green tint on top, so the clip should still have movement after it is darkened.

### Showreel

| File | Used by |
| --- | --- |
| `public/images/posters/reel-01.jpg` … `reel-08.jpg` | Card posters. Wide cards are 16:9, tall cards are 9:16. |
| `showreel.reels[].src` in `content/site.ts` | Muted hover preview. All eight cards currently share `hero-mobile.mp4`. |

Replace the poster path and `src` per card when you have real cuts. Keep posters under about 200KB.

### Other

| File | Notes |
| --- | --- |
| `public/grain.png` | 180×180 tile, drawn at 4.5% opacity over the whole page. |
| `app/icon.svg` | Favicon. |
| `site.links.calendar` | Calendly (or other) booking URL. The final section is a placeholder grid until you paste an embed. |
| `site.pricing.plans` | Spark $499, Momentum $999, Studio $2,499 per month. Naira is a live conversion. |
| Testimonials, logos, stats | Marked as placeholders in the UI. Replace them in `content/site.ts`. |

Regenerate the placeholders with:

```bash
python scripts/make_media.py
```

That script needs Pillow and `imageio-ffmpeg`.

## Motion

Durations are 0.25s, 0.6s, and 1.1s. The ease is `cubic-bezier(0.22, 1, 0.36, 1)`. The intro slate plays once per session. `prefers-reduced-motion` skips the slate, the pinned sequences, the custom cursor, and the hero video.
