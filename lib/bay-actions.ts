"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addRequestNote,
  approveDeliveredRequest,
  createQueuedRequest,
  deliverActiveRequest,
  moveQueuedRequest,
  parseLinks,
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
  if (!saved) redirect("/bay?error=bay");
  revalidatePath("/bay");
  revalidatePath("/bays");
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
  await startNextRequest(user, bayId);
  revalidatePath("/bays");
  revalidatePath(`/bays/${bayId}`);
  redirect(`/bays/${bayId}`);
}

export async function markDelivered(formData: FormData) {
  const user = await staffUser();
  const bayId = String(formData.get("bayId") ?? "");
  await deliverActiveRequest(user, bayId);
  revalidatePath("/bays");
  revalidatePath(`/bays/${bayId}`);
  redirect(`/bays/${bayId}`);
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
