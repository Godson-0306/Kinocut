import type { Metadata } from "next";
import { formatNaira, formatPrice, site } from "@/content/site";
import { openBayFromCharge } from "@/lib/accounts";
import { planById, verifyTransaction } from "@/lib/billing";
import { MagneticButton } from "@/components/MagneticButton";
import { SetPasswordForm } from "@/components/SetPasswordForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Subscription",
  description: "Confirmation for a Kinocut monthly subscription.",
  robots: { index: false, follow: false },
};

type Search = {
  transaction_id?: string;
  status?: string;
};

export default async function CheckoutReturnPage({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  const cancelled = params.status === "cancelled" && !params.transaction_id;
  const charge = params.transaction_id ? await verifyTransaction(params.transaction_id).catch(() => null) : null;
  const plan = charge ? planById(charge.plan) : null;
  const price = charge ? (charge.currency === "NGN" ? formatNaira(charge.amount) : formatPrice(charge.amount)) : null;
  let opened: { hasPassword: boolean } | null = null;
  let bayError = false;
  if (charge?.email && params.transaction_id) {
    try {
      opened = await openBayFromCharge(charge, params.transaction_id);
    } catch {
      bayError = true;
    }
  }

  return (
    <main id="main" className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-ink px-5 py-32 text-white">
      <div className="bg-aurora pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full opacity-40 blur-3xl" />
      <div className="relative w-full max-w-md rounded-panel bg-white p-8 text-ink shadow-card">
        <p className="type-micro text-blue-700">Kinocut</p>
        {charge && plan && price ? (
          <>
            <h1 className="type-sub mt-3">Your monthly subscription has started.</h1>
            <p className="type-body mt-3 text-ink-600">
              {plan.name} is {price} {site.pricing.cadence}. Flutterwave will email the receipt. The charge renews each month until you cancel it there.
            </p>
            {bayError ? <p className="type-body mt-4 text-ink-600">The bay could not be opened yet. Sign in once the database is connected.</p> : null}
            {opened && !opened.hasPassword && params.transaction_id ? <SetPasswordForm transactionId={params.transaction_id} /> : null}
            {opened?.hasPassword ? (
              <MagneticButton href="/bay" className="mt-8 w-full">
                Open your bay
              </MagneticButton>
            ) : null}
          </>
        ) : (
          <>
            <h1 className="type-sub mt-3">{cancelled ? "This payment was cancelled." : "We could not confirm this payment."}</h1>
            <p className="type-body mt-3 text-ink-600">
              {cancelled
                ? "You can join from the pricing section whenever you are ready."
                : "Flutterwave has not confirmed a successful charge, so a subscription was not started."}
            </p>
            <MagneticButton href="/#pricing" className="mt-8 w-full">
              Return to pricing
            </MagneticButton>
          </>
        )}
      </div>
    </main>
  );
}
