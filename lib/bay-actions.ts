"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addRequestNote,
  approveDeliveredRequest,
  createQueuedRequest,
  deliverActiveRequest,
  moveQueuedRequest,
  removeClientBay,
  parseLinks,
  saveBrandKit,
  startNextRequest,
} from "@/lib/accounts";
import { currentUser } from "@/lib/session";

async function clientUser() {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.role === "staff") redirect("/bays");
  return user;
}

async function staffUser() {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.role !== "staff") redirect("/bay");
  return user;
}

export async function createRequest(formData: FormData) {
  const user = await clientUser();
  const bayId = String(formData.get("bayId") ?? "");
  const title = String(formData.get("title") ?? "").trim().slice(0, 120);
  const brief = String(formData.get("brief") ?? "").trim().slice(0, 2000);
  const parsed = parseLinks(String(formData.get("links") ?? ""));
  if (!title) redirect("/bay?error=title");
  if (!parsed.ok) redirect("/bay?error=links");
  const saved = await createQueuedRequest(user, bayId, title, brief, parsed.links);
  if (saved === "kit") redirect("/bay?error=kit");
  if (saved !== "ok") redirect("/bay?error=bay");
  revalidatePath("/bay");
  revalidatePath("/bays");
  redirect("/bay");
}

export async function saveKit(formData: FormData) {
  const user = await clientUser();
  const bayId = String(formData.get("bayId") ?? "");
  const saved = await saveBrandKit(user, bayId, {
    fonts: String(formData.get("fonts") ?? ""),
    colors: String(formData.get("colors") ?? ""),
    captionStyle: String(formData.get("captionStyle") ?? ""),
    hook: String(formData.get("hook") ?? ""),
    cta: String(formData.get("cta") ?? ""),
    logo: String(formData.get("logo") ?? ""),
    music: String(formData.get("music") ?? ""),
    references: String(formData.get("references") ?? ""),
  });
  if (!saved) redirect(`/bay?kit=${encodeURIComponent(bayId)}&error=kit`);
  revalidatePath("/bay");
  revalidatePath(`/bay`);
  redirect("/bay");
}

export async function moveRequest(formData: FormData) {
  const user = await clientUser();
  const id = String(formData.get("id") ?? "");
  const direction = formData.get("direction") === "down" ? "down" : "up";
  await moveQueuedRequest(user, id, direction);
  revalidatePath("/bay");
  redirect("/bay");
}

export async function startNext(formData: FormData) {
  const user = await staffUser();
  const bayId = String(formData.get("bayId") ?? "");
  const requestId = String(formData.get("requestId") ?? "");
  await startNextRequest(user, bayId);
  revalidatePath("/bays");
  revalidatePath(`/bays/${bayId}`);
  if (requestId) revalidatePath(`/bays/${bayId}/${requestId}`);
  redirect(requestId ? `/bays/${bayId}/${requestId}` : `/bays/${bayId}`);
}

export async function removeBay(formData: FormData) {
  const user = await staffUser();
  const bayId = String(formData.get("bayId") ?? "");
  if (formData.get("confirm") !== "yes") redirect(`/bays/${bayId}`);
  const removed = await removeClientBay(user, bayId);
  if (!removed) redirect(`/bays/${bayId}`);
  revalidatePath("/bays");
  revalidatePath("/bay");
  redirect("/bays");
}

export async function markDelivered(formData: FormData) {
  const user = await staffUser();
  const bayId = String(formData.get("bayId") ?? "");
  const requestId = String(formData.get("requestId") ?? "");
  const back = requestId ? `/bays/${bayId}/${requestId}` : `/bays/${bayId}`;
  const saved = await deliverActiveRequest(user, bayId, String(formData.get("delivery") ?? ""));
  if (!saved) redirect(`${back}?error=delivery`);
  revalidatePath("/bays");
  revalidatePath(`/bays/${bayId}`);
  revalidatePath(back);
  revalidatePath("/bay");
  redirect(back);
}

export async function approveRequest(formData: FormData) {
  const user = await clientUser();
  const id = String(formData.get("id") ?? "");
  await approveDeliveredRequest(user, id);
  revalidatePath("/bay");
  revalidatePath(`/bay/${id}`);
  redirect(`/bay/${id}`);
}

export async function addNote(formData: FormData) {
  const user = await currentUser();
  if (!user) redirect("/login");
  const id = String(formData.get("id") ?? "");
  const body = String(formData.get("body") ?? "").trim().slice(0, 2000);
  const staff = user.role === "staff";
  const bayId = String(formData.get("bayId") ?? "");
  const back = staff ? `/bays/${bayId}/${id}` : `/bay/${id}`;
  if (!body) redirect(`${back}?error=note`);
  await addRequestNote(user, id, body);
  revalidatePath(back);
  redirect(back);
}
