import { palette } from "./tokens";

export const site = {
  name: "Kinocut",
  url: "https://kinocut.pro",
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
    accent: "footage",
    support: "A full edit bay for one flat monthly fee.",
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
    lede: "Hover a card for a short preview. Click it to watch the full cut.",
    note: "Recent cuts",
    compareTitle: "Raw against the grade.",
    compareAccent: "grade",
    compareLede: "Drag the playhead across the frame. Left is the rush. Right is the bay.",
    reels: [
      {
        id: "northlane",
        client: "Camelwood",
        title: "Documentary",
        category: "Documentary",
        timecode: "00:08:12:04",
        aspect: "wide" as const,
        poster: "/images/posters/reel-01.jpg",
        src: "/videos/reels/camelwood.mp4",
        full: "/videos/reels/camelwood-full.mp4",
      },
      {
        id: "halcyon",
        client: "Odogwu Bitters",
        title: "Ad",
        category: "Ads",
        timecode: "00:00:18:22",
        aspect: "tall" as const,
        poster: "/images/posters/reel-04.jpg",
        src: "/videos/reels/odogwu.mp4",
        full: "/videos/reels/odogwu-full.mp4",
      },
      {
        id: "lowtide",
        client: "International Breweries LTD.",
        title: "Safe Peak",
        category: "Campaign",
        timecode: "00:34:02:11",
        aspect: "wide" as const,
        poster: "/images/posters/reel-05.jpg",
        src: "/videos/reels/safe-peak.mp4",
        full: "/videos/reels/safe-peak-full.mp4",
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
    lede: "",
    quotes: [
      {
        quote:
          "I stopped losing Sundays to the timeline. I send a folder, and a finished video is waiting before the next upload day.",
        name: "Mr. Macpherson",
        role: "HappiDev",
      },
      {
        quote:
          "Our social team treats the bay like an in-house editor. The queue is clear, the cuts are sharp, and nobody is chasing notes in a chat thread.",
        name: "Mr. Godson",
        role: "G-Tech Industries",
      },
      {
        quote:
          "Podcast clips used to die on a hard drive. Now every episode turns into a week of shorts without me opening an editor.",
        name: "Mr. Ibarakumo",
        role: "Peace Gate Fashion",
      },
      {
        quote:
          "The launch slipped and we came back the next month. One email, and the bay still knew how we like our captions.",
        name: "Mr. Ramoni",
        role: "International Breweries LTD.",
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
    title: "Three plans. One bay.",
    accent: "bay",
    lede: "Everything you need to publish. Nothing that needs a producer to explain.",
    cadence: "/ month",
    slots: "3 bays open this month",
    cta: "Join today",
    plans: [
      {
        id: "spark",
        name: "Spark",
        price: 499,
        featured: false,
        features: [
          "One active request",
          "Short-form, clips, UGC, and ads up to 60s",
          "Interviews and vlogs up to 5 minutes",
          "YouTube, demos, podcasts, and motion graphics not included",
          "Short-form averages 48 hours",
          "Long-form in 4 business days",
          "1 revision round",
        ],
      },
      {
        id: "momentum",
        name: "Momentum",
        price: 999,
        featured: true,
        sticker: "Most chosen",
        features: [
          "One active request",
          "Short-form up to 90s",
          "Interviews and vlogs up to 15 minutes",
          "YouTube and product demos up to 15 minutes",
          "Podcasts and webinars from up to 60 minutes of footage",
          "Animated captions and lower-thirds",
          "Short-form averages 48 hours",
          "Long-form in 3 business days",
          "2 revision rounds",
        ],
      },
      {
        id: "studio",
        name: "Studio",
        price: 2499,
        featured: false,
        features: [
          "One active request",
          "Short-form up to 90s",
          "Interviews, vlogs, YouTube, and demos up to 20 minutes",
          "Podcasts and webinars from up to 90 minutes of footage",
          "Custom motion graphics up to 30s",
          "Short-form and long-form average 48 hours",
          "2 revision rounds, plus free minor tweaks",
        ],
      },
    ],
    notes: [
      {
        title: "Every plan",
        body: "An unlimited queue you can reorder until a request starts. One active request at a time. The next starts when you approve, or after 3 business days of silence. Turnaround is business days from a complete brief and footage. Brand kit at onboarding. You own the final files.",
      },
      {
        title: "How a request counts",
        body: "One request is one finished video, plus up to 3 resizes. Up to 5 clips from one source count as one request. Send notes as one message with timestamps. A new direction after approval is a new request. Work over the length limit is split or quoted. Shoots, scripting, voiceover talent, 3D, and music outside the library are not included. Agencies reselling the work need a white-label plan.",
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
        a: "Short-form averages 48 hours on every plan, once the brief and footage are complete. Long-form is 4 business days on Spark, 3 on Momentum, and 48 hours on Studio. Turnaround is counted in business days.",
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
        a: "One active request at a time. You can line up an unlimited queue and reorder it until a request starts. When you approve a cut, or if we have not heard back within 3 business days of delivery, the next request starts.",
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
        a: "Spark includes 1 revision round. Momentum includes 2. Studio includes 2, plus free minor tweaks. Send the notes as one message with timestamps. A new direction after you approve the cut is a new request.",
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

export function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
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
          "@type": "AggregateOffer",
          lowPrice: String(Math.min(...site.pricing.plans.map((plan) => plan.price))),
          highPrice: String(Math.max(...site.pricing.plans.map((plan) => plan.price))),
          offerCount: site.pricing.plans.length,
          priceCurrency: "USD",
          url: `${site.url}/#pricing`,
          availability: "https://schema.org/InStock",
          description: "Spark, Momentum, or Studio. One request at a time.",
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
