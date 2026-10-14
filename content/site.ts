import { palette } from "./tokens";

export const site = {
  name: "Kinocut",
  url: "https://kinocut.studio",
  email: "hello@kinocut.studio",
  location: "A remote edit bay. Worldwide turnaround.",
  meta: {
    title: "Kinocut — Unlimited video editing for one monthly fee",
    description:
      "Unlimited video editing for creators and teams. YouTube, shorts, podcasts, and ads, one request at a time, for one flat monthly fee. Cancel anytime.",
  },
  links: {
    start: "/#pricing",
    join: "/#book",
    book: "/#book",
    pricing: "/#pricing",
    login: "/login",
    /** Replace with your Calendly (or other) scheduling link. */
    calendar: "https://calendly.com/",
    email: "mailto:hello@kinocut.studio",
    terms: "/terms",
    privacy: "/privacy",
    home: "/",
  },
  hero: {
    badge: "Now accepting 3 new clients",
    line1: "Drop the rushes.",
    line2Before: "Leave with the ",
    accent: "film",
    support:
      "Kinocut edits YouTube, shorts, podcasts, and ads for one flat monthly fee, one video at a time, and you can cancel anytime.",
    subline: "Cancel anytime.",
    primary: "Start today",
    secondaryTitle: "Book a 15-min intro call",
    secondaryMeta: "No deck. Just the work.",
  },
  logos: {
    label: "Creators and brands we edit for",
    brands: [
      { name: "Camelwood", href: "https://carmelwoodprocessing.com" },
      { name: "G-Tech Industries", href: "https://g-tech-industries.vercel.app" },
      { name: "HappiDev", href: "https://happidev.pro" },
      { name: "Odogwu Bitters" },
      { name: "International Breweries LTD." },
    ],
  },
  how: {
    timecode: "00:00:08:00",
    title: "Three moves. Then we cut.",
    accent: "cut",
    lede: "Subscribe, send a link, get a finished video. Then do it again for the rest of the month.",
    steps: [
      {
        id: "subscribe" as const,
        index: "01",
        title: "Subscribe",
        body: "Pick the bay. One flat monthly fee, one queue, no hourly meter. Cancel before the next bill.",
      },
      {
        id: "send" as const,
        index: "02",
        title: "Send footage",
        body: "Drop a Drive, Dropbox, Frame.io, or WeTransfer link. Add a sentence about the job of the video. We take it from the top of the queue.",
      },
      {
        id: "receive" as const,
        index: "03",
        title: "Receive edits",
        body: "A finished cut comes back, usually within 48 hours, with captions, grade, and sound cleaned up. Notes are welcome until it feels like yours.",
      },
    ],
    pills: [
      "YouTube",
      "Reels",
      "TikTok",
      "Podcasts",
      "Ads",
      "Shorts",
      "Course videos",
      "Captions",
      "Color grade",
      "Motion graphics",
      "UGC",
      "Thumbnails",
      "Sound cleanup",
    ],
    founder: {
      kicker: "The bay",
      body: "Kinocut is a small bay of editors, colorists, and motion designers. You get a dedicated queue, not a ticket number. We work remote, across time zones, so a file sent tonight can be waiting with coffee.",
      seats: [
        { initials: "ED", label: "Edit", className: "bg-blue-500 text-white" },
        { initials: "CO", label: "Color", className: "bg-green-500 text-white" },
        { initials: "MO", label: "Motion", className: "bg-blue-300 text-ink" },
        { initials: "SN", label: "Sound", className: "bg-ink-600 text-white" },
      ],
    },
  },
  showreel: {
    timecode: "00:00:18:12",
    title: "The timeline lately.",
    accent: "timeline",
    lede: "Sample reels standing in for client work. Swap the posters and preview files in content/site.ts when your masters are ready.",
    note: "Sample reels",
    compareTitle: "Raw against the grade.",
    compareAccent: "grade",
    compareLede: "Drag the playhead across the frame. Left is the rush. Right is the bay.",
    reels: [
      {
        id: "northlane",
        client: "Camelwood",
        title: "Launch film",
        category: "YouTube",
        timecode: "00:08:12:04",
        aspect: "wide" as const,
        poster: "/images/posters/reel-01.jpg",
        src: "/videos/hero-mobile.mp4",
      },
      {
        id: "fieldnote",
        client: "G-Tech Industries",
        title: "Desk diary",
        category: "Shorts",
        timecode: "00:00:42:18",
        aspect: "tall" as const,
        poster: "/images/posters/reel-02.jpg",
        src: "/videos/hero-mobile.mp4",
      },
      {
        id: "orbit",
        client: "HappiDev",
        title: "Course trailer",
        category: "Course",
        timecode: "00:02:16:09",
        aspect: "wide" as const,
        poster: "/images/posters/reel-03.jpg",
        src: "/videos/hero-mobile.mp4",
      },
      {
        id: "halcyon",
        client: "Odogwu Bitters",
        title: "UGC test",
        category: "Ads",
        timecode: "00:00:18:22",
        aspect: "tall" as const,
        poster: "/images/posters/reel-04.jpg",
        src: "/videos/hero-mobile.mp4",
      },
      {
        id: "lowtide",
        client: "International Breweries LTD.",
        title: "Episode 40",
        category: "Podcast",
        timecode: "00:34:02:11",
        aspect: "wide" as const,
        poster: "/images/posters/reel-05.jpg",
        src: "/videos/hero-mobile.mp4",
      },
      {
        id: "paperplane",
        client: "Camelwood",
        title: "Reel pack",
        category: "Reels",
        timecode: "00:00:27:06",
        aspect: "tall" as const,
        poster: "/images/posters/reel-06.jpg",
        src: "/videos/hero-mobile.mp4",
      },
      {
        id: "lumen",
        client: "G-Tech Industries",
        title: "Product demo",
        category: "YouTube",
        timecode: "00:06:44:15",
        aspect: "wide" as const,
        poster: "/images/posters/reel-07.jpg",
        src: "/videos/hero-mobile.mp4",
      },
      {
        id: "cassette",
        client: "HappiDev",
        title: "Tour teaser",
        category: "Ads",
        timecode: "00:00:15:03",
        aspect: "tall" as const,
        poster: "/images/posters/reel-08.jpg",
        src: "/videos/hero-mobile.mp4",
      },
    ],
  },
  benefits: {
    timecode: "00:00:32:06",
    title: "Why teams never go back",
    accent: "back",
    lede: "The bay is built for people who publish every week and do not want an editing shift on top of it.",
    items: [
      {
        visual: "board" as const,
        title: "A shared board",
        body: "Every request lives on one board you and your editor can both see. Status, files, and notes stay out of the inbox.",
        tint: "blue" as const,
        span: "lg" as const,
      },
      {
        visual: "rate" as const,
        title: "One flat monthly rate",
        body: "The number on the card is the number on the invoice. No hourly rounding, no rush fees, no per-export tax.",
        tint: "green" as const,
        span: "md" as const,
      },
      {
        visual: "clock" as const,
        title: "About 48 hours",
        body: "Average turnaround is roughly two days once a request is complete. We name the slot up front.",
        tint: "blue" as const,
        span: "sm" as const,
      },
      {
        visual: "trophy" as const,
        title: "Pro-level finish",
        body: "Cut, grade, sound cleanup, captions, and motion. The work should look like a studio made it.",
        tint: "green" as const,
        span: "sm" as const,
      },
      {
        visual: "cancel" as const,
        title: "Cancel anytime",
        body: "Done for now? Cancel before the next bill. Shipping two videos at once? Add a second bay. Style notes stay on file.",
        tint: "green" as const,
        span: "md" as const,
      },
      {
        visual: "files" as const,
        title: "You own every file",
        body: "Masters, captions, thumbnails, and project files. Nothing is watermarked, and nothing is held hostage.",
        tint: "blue" as const,
        span: "md" as const,
      },
    ],
  },
  proof: {
    timecode: "00:00:44:18",
    title: "Loved by people who ship.",
    accent: "ship",
    lede: "Placeholder words from the kind of teams we cut for. Replace them with real clients when the bay is live.",
    quotes: [
      {
        quote:
          "I stopped losing Sundays to the timeline. I send a folder, and a finished video is waiting before the next upload day.",
        name: "Maya Chen",
        role: "Science YouTube · placeholder",
      },
      {
        quote:
          "Our social team treats the bay like an in-house editor. The queue is clear, the cuts are sharp, and nobody is chasing notes in a chat thread.",
        name: "Jordan Hale",
        role: "Brand studio · placeholder",
      },
      {
        quote:
          "Podcast clips used to die on a hard drive. Now every episode turns into a week of shorts without me opening an editor.",
        name: "Sam Okonkwo",
        role: "Interviewer · placeholder",
      },
      {
        quote:
          "The launch slipped and we came back the next month. One email, and the bay still knew how we like our captions.",
        name: "Lena Voss",
        role: "Course studio · placeholder",
      },
    ],
    stats: [
      { value: 1400, suffix: "+", label: "Videos delivered" },
      { value: 48, suffix: "h", label: "Average turnaround" },
      { value: 70, suffix: "", label: "Active clients" },
      { value: 96, suffix: "%", label: "Stay past month three" },
    ],
  },
  pricing: {
    timecode: "00:00:58:00",
    title: "One plan. The whole bay.",
    accent: "bay",
    lede: "Everything you need to publish. Nothing that needs a producer to explain.",
    /** Placeholder launch price. Edit these two numbers. */
    price: 4500,
    compareAt: 6200,
    cadence: "/ month",
    sticker: "Launch pricing",
    slots: "3 bays open this month",
    cta: "Join today",
    features: [
      "One active request at a time",
      "About 48 hours average turnaround",
      "Unlimited revisions on the open cut",
      "Up to 2 users on the bay",
      "Shared request board",
      "Captions and subtitles included",
      "Commercial music and stock footage included",
      "Cancel anytime",
    ],
    reassurances: [
      {
        title: "Cancel anytime",
        body: "Write to us before the next bill. The month you paid stays usable, and your style notes stay on file.",
      },
      {
        title: "Try it for a week",
        body: "If the first delivery misses, tell us within seven days and we refund that first payment.",
      },
    ],
  },
  faq: {
    timecode: "00:01:12:04",
    title: "Before you hit record.",
    accent: "record",
    lede: "The short version of how the bay behaves. If yours is a strange case, bring it to the intro call.",
    items: [
      {
        q: "How fast do cuts come back?",
        a: "Most requests land within about 48 hours of a complete handoff. A tight 15-second reel can be quicker. A 20-minute YouTube episode with chapters, captions, and a thumbnail takes the longer side of that window. We tell you the slot when the request goes in.",
      },
      {
        q: "How do I send footage?",
        a: "A link is enough. Google Drive, Dropbox, Frame.io, or WeTransfer all work. Name the folder with the publish date, toss in brand files if you have them, and tell us the one thing the video must do. We do not need your whole archive.",
      },
      {
        q: "What happens in the first week?",
        a: "You book a 15-minute intro. We learn the channel, the fonts, the words you never want on screen, and where files should live. Then one request is open. The first cut is where we lock the style, so leave a little room for notes.",
      },
      {
        q: "Can I stack requests?",
        a: "One active request at a time. That is the whole trick: your editor stays with the video in front of them instead of juggling five. When a cut is delivered, or you park it, the next one starts. Need more in parallel? Add a second bay.",
      },
      {
        q: "How does canceling work?",
        a: "Cancel from your account, or email us, before the next billing date. The month you already paid stays usable until it ends. If you come back later, the queue, brand notes, and open files are where you left them.",
      },
      {
        q: "Do you cut long-form and shorts?",
        a: "Yes. YouTube episodes, course lessons, podcasts, and the short versions that fall out of them. A request can be one long video or a batch of shorts cut from a single episode. Say which one you want the bay on.",
      },
      {
        q: "What software do you use?",
        a: "Premiere Pro for the cut, After Effects for motion and captions that need to move, DaVinci Resolve for the grade. You receive exported masters, and project files on request. You do not need any of those apps to work with us.",
      },
      {
        q: "What counts as a revision?",
        a: "Notes on a delivered cut are included, and they are not rationed. Move the chapter, swap the hook, quiet the room tone: that is a revision. A new video, a new campaign of aspect ratios, or a different episode is a new request.",
      },
      {
        q: "What do you not take on?",
        a: "We do not shoot. We do not build 3D scenes, feature-length films, or heavy VFX such as set extensions, creature work, or frame-by-frame cleanup. If a job needs a specialist beyond editing, color, sound cleanup, captions, and motion graphics, we say so before it enters the queue.",
      },
      {
        q: "Is the music legal to publish?",
        a: "Yes. Commercial music and stock footage in the cut are licensed for your channels and ads. If you want a specific commercial track, send it only when you already have the rights. We will not pull a song off a streaming app.",
      },
      {
        q: "What is the refund promise?",
        a: "If the first week is a miss, tell us within seven days of the first delivery and we refund that first payment, minus any stock licenses already bought for the cut. After that week you can cancel anytime. The current month is not prorated.",
      },
      {
        q: "Can I subscribe for a single busy month?",
        a: "Yes. Join, ship the slate you need, and cancel before the next bill. A lot of course launches and product drops do exactly that.",
      },
    ],
  },
  final: {
    timecode: "00:01:24:12",
    line1: "Bring the footage.",
    line2: "We'll bring the finish.",
    accent: "finish",
    lede: "Book a 15-minute intro. We will learn the channel, open the queue, and cut the first one.",
    cta: "Book the intro",
    emailLabel: "Or write to the bay",
    calendarNote: "Placeholder slots. Paste your Calendly embed here when scheduling is live.",
    slots: ["Tue · 10:30", "Tue · 14:00", "Wed · 09:15", "Thu · 16:40"],
  },
  footer: {
    stickers: [
      "Cancel anytime",
      "48h turns",
      "You own the files",
      "One request at a time",
      "Now rolling",
      "Captions included",
      "Premiere · AE · Resolve",
    ],
  },
  login: {
    title: "The bay door",
    lede: "Client login is not wired up yet. Leave your email and we will know you are waiting, or write to us directly.",
    success: "Noted. The client bay is not connected yet. Email hello@kinocut.studio and we will open the door.",
  },
} as const;

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: site.name,
        url: site.url,
        email: site.email,
        description: site.meta.description,
      },
      {
        "@type": "WebSite",
        name: site.name,
        url: site.url,
        description: site.meta.description,
      },
      {
        "@type": "Service",
        name: "Unlimited video editing subscription",
        serviceType: "Video editing",
        provider: { "@type": "Organization", name: site.name },
        areaServed: "Worldwide",
        audience: "YouTubers, podcasters, agencies, startups, course creators, and social teams",
        url: site.url,
        description: site.meta.description,
        offers: {
          "@type": "Offer",
          price: String(site.pricing.price),
          priceCurrency: "USD",
          url: `${site.url}/#pricing`,
          availability: "https://schema.org/InStock",
          description: "One flat monthly fee. One request at a time. Cancel anytime.",
        },
      },
      {
        "@type": "HowTo",
        name: "How Kinocut works",
        description: site.how.lede,
        step: site.how.steps.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: step.title,
          text: step.body,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: site.faq.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
  };
}

export { palette };
