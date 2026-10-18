import { saveKit } from "@/lib/bay-actions";
import type { BrandKitView } from "@/lib/accounts";
import { MagneticButton } from "./MagneticButton";

export function BrandKitForm({ bayId, kit }: { bayId: string; kit: BrandKitView }) {
  return (
    <form action={saveKit} className="grid gap-4">
      <input type="hidden" name="bayId" value={bayId} />
      <p className="type-body text-ink-600">
        This stays with the project. Later requests reuse it, and footage still arrives as links.
      </p>
      <label className="block">
        <span className="type-micro text-blue-700">Fonts</span>
        <input className="field mt-2" name="fonts" required maxLength={400} defaultValue={kit.fonts} placeholder="The typefaces, and where the files live" />
      </label>
      <label className="block">
        <span className="type-micro text-blue-700">Colors</span>
        <input className="field mt-2" name="colors" required maxLength={400} defaultValue={kit.colors} placeholder="Hex values or the names you use" />
      </label>
      <label className="block">
        <span className="type-micro text-blue-700">Logo</span>
        <input className="field mt-2" type="url" name="logo" required defaultValue={kit.logo} placeholder="https:// link to the logo file" />
      </label>
      <label className="block">
        <span className="type-micro text-blue-700">Caption style</span>
        <input className="field mt-2" name="captionStyle" required maxLength={400} defaultValue={kit.captionStyle} placeholder="How captions should look and move" />
      </label>
      <label className="block">
        <span className="type-micro text-blue-700">Music</span>
        <input className="field mt-2" type="url" name="music" required defaultValue={kit.music} placeholder="https:// link to the track or a folder" />
      </label>
      <label className="block">
        <span className="type-micro text-blue-700">Reference videos</span>
        <textarea className="field mt-2 min-h-24" name="references" required defaultValue={kit.references} placeholder="One link per line" />
      </label>
      <label className="block">
        <span className="type-micro text-blue-700">Hook</span>
        <textarea className="field mt-2 min-h-24" name="hook" required maxLength={800} defaultValue={kit.hook} placeholder="How the first seconds should open" />
      </label>
      <label className="block">
        <span className="type-micro text-blue-700">CTA template</span>
        <textarea className="field mt-2 min-h-24" name="cta" required maxLength={800} defaultValue={kit.cta} placeholder="The end card, line, and where it points" />
      </label>
      <MagneticButton type="submit">Save the brand kit</MagneticButton>
    </form>
  );
}

export function BrandKitCard({ kit }: { kit: BrandKitView }) {
  const rows = [
    ["Fonts", kit.fonts],
    ["Colors", kit.colors],
    ["Caption style", kit.captionStyle],
    ["Hook", kit.hook],
    ["CTA", kit.cta],
  ] as const;
  const links = [
    ["Logo", kit.logo],
    ["Music", kit.music],
  ] as const;

  return (
    <div className="grid gap-4">
      {rows.map(([label, value]) => (
        <div key={label}>
          <p className="type-micro text-blue-700">{label}</p>
          <p className="type-body mt-1 whitespace-pre-wrap text-ink-600">{value}</p>
        </div>
      ))}
      {links.map(([label, href]) => (
        <div key={label}>
          <p className="type-micro text-blue-700">{label}</p>
          <a className="mt-1 block break-all text-blue-700 underline" href={href} target="_blank" rel="noreferrer">
            {href}
          </a>
        </div>
      ))}
      <div>
        <p className="type-micro text-blue-700">Reference videos</p>
        <ul className="mt-1 grid gap-2">
          {kit.references.split("\n").filter(Boolean).map((href) => (
            <li key={href}>
              <a className="break-all text-blue-700 underline" href={href} target="_blank" rel="noreferrer">
                {href}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
