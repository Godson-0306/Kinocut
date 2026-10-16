"use server";

import { redirect } from "next/navigation";
import { findUserRecord, openBayFromCharge, setPasswordForEmail, setupStaffAccount } from "@/lib/accounts";
import { verifyTransaction } from "@/lib/billing";
import { safeEqual, verifyPassword } from "@/lib/passwords";
import { clearSession, setSession } from "@/lib/session";

export type FormState = { error: string };

function staffEmails() {
  return (process.env.KINOCUT_STAFF_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function passwordProblem(password: string, confirm: string) {
  if (password.length < 8 || password.length > 200) return "Use at least 8 characters.";
  if (password !== confirm) return "Those passwords do not match.";
  return "";
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  let user;
  try {
    user = await findUserRecord(email);
  } catch {
    return { error: "The bay could not be reached." };
  }
  if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "That email and password did not match." };
  }
  await setSession(user._id.toString());
  redirect(user.role === "staff" ? "/bays" : "/bay");
}

export async function setupStaff(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const code = String(formData.get("code") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const expected = process.env.STAFF_SETUP_CODE ?? "";
  if (!staffEmails().includes(email)) return { error: "That email is not a Kinocut login." };
  if (!expected || !safeEqual(code, expected)) return { error: "That setup code did not match." };
  const problem = passwordProblem(password, confirm);
  if (problem) return { error: problem };
  let result;
  try {
    result = await setupStaffAccount(email, password);
  } catch {
    return { error: "The bay could not be reached." };
  }
  if (result === "exists") return { error: "This account already has a password. Sign in." };
  if (!result) return { error: "The staff door could not be opened." };
  await setSession(result.id);
  redirect("/bays");
}

export async function setPasswordFromPayment(_prev: FormState, formData: FormData): Promise<FormState> {
  const transactionId = String(formData.get("transactionId") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const problem = passwordProblem(password, confirm);
  if (problem) return { error: problem };
  const charge = await verifyTransaction(transactionId).catch(() => null);
  if (!charge?.email) return { error: "This payment could not be confirmed." };
  await openBayFromCharge(charge, transactionId);
  const user = await setPasswordForEmail(charge.email, password);
  if (!user) return { error: "This account already has a password. Sign in." };
  await setSession(user.id);
  redirect("/bay");
}

export async function logout() {
  await clearSession();
  redirect("/login");
}
