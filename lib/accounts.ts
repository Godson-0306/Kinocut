import { ObjectId, type Filter } from "mongodb";
import { formatNaira, formatPrice } from "@/content/site";
import { planName, type ChargeCurrency, type PlanId, type VerifiedCharge } from "@/lib/billing";
import { db } from "@/lib/db";
import { sendPaymentEmails } from "@/lib/mail";
import { hashPassword } from "@/lib/passwords";

export type Role = "client" | "staff";
export type RequestStatus = "queued" | "active" | "delivered" | "approved";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

type UserDoc = {
  _id: ObjectId;
  email: string;
  name: string;
  passwordHash: string | null;
  role: Role;
  createdAt: Date;
};

type BrandKitDoc = {
  fonts: string;
  colors: string;
  captionStyle: string;
  hook: string;
  cta: string;
  logo: string;
  music: string;
  references: string[];
  completedAt: Date;
};

type BayDoc = {
  _id: ObjectId;
  userId: ObjectId;
  plan: PlanId;
  status: "active";
  currency: "USD" | "NGN";
  amount: number;
  txRef: string;
  transactionId: string;
  createdAt: Date;
  notifiedAt?: Date;
  brandKit?: BrandKitDoc;
};

type RequestDoc = {
  _id: ObjectId;
  bayId: ObjectId;
  title: string;
  brief: string;
  links: string[];
  deliveryLink?: string;
  status: RequestStatus;
  position: number;
  createdAt: Date;
  updatedAt: Date;
};

type NoteDoc = {
  _id: ObjectId;
  requestId: ObjectId;
  authorId: ObjectId;
  body: string;
  createdAt: Date;
};

export type RequestSummary = {
  id: string;
  title: string;
  status: RequestStatus;
  position: number;
  age: string;
  brief: string;
  linkCount: number;
  deliveryLink: string | null;
};

export type BrandKitView = {
  fonts: string;
  colors: string;
  captionStyle: string;
  hook: string;
  cta: string;
  logo: string;
  music: string;
  references: string;
  complete: boolean;
};

export type BayView = {
  id: string;
  clientName: string;
  planName: string;
  price: string;
  brandKit: BrandKitView;
  requests: RequestSummary[];
};

export type NoteView = {
  id: string;
  author: string;
  body: string;
  at: string;
};

export type RequestDetail = {
  id: string;
  bayId: string;
  title: string;
  brief: string;
  links: string[];
  deliveryLink: string | null;
  status: RequestStatus;
  canStart: boolean;
  brandKit: BrandKitView;
  notes: NoteView[];
};

export type DeskLane = "bench" | "start" | "client";

export type DeskItem = {
  bayId: string;
  requestId: string;
  clientName: string;
  planName: string;
  title: string;
  age: string;
  lane: DeskLane;
};

export type ProjectItem = {
  id: string;
  clientName: string;
  planName: string;
  price: string;
  inMotion: boolean;
  queued: number;
  bench: number;
  waiting: number;
  kitReady: boolean;
};

function users() {
  return db().then((database) => database.collection<UserDoc>("users"));
}

function bays() {
  return db().then((database) => database.collection<BayDoc>("bays"));
}

type CheckoutAttemptDoc = {
  _id: ObjectId;
  name: string;
  email: string;
  plan: PlanId;
  currency: ChargeCurrency;
  amount: number;
  txRef?: string;
  status: "started" | "paid";
  createdAt: Date;
};

function checkoutAttempts() {
  return db().then((database) => database.collection<CheckoutAttemptDoc>("checkoutAttempts"));
}

export async function recordCheckoutAttempt(input: {
  name: string;
  email: string;
  plan: PlanId;
  currency: ChargeCurrency;
  amount: number;
}) {
  const inserted = await (await checkoutAttempts()).insertOne({
    _id: new ObjectId(),
    name: input.name,
    email: input.email,
    plan: input.plan,
    currency: input.currency,
    amount: input.amount,
    status: "started",
    createdAt: new Date(),
  });
  return inserted.insertedId;
}

export async function attachCheckoutTxRef(id: ObjectId, txRef: string) {
  await (await checkoutAttempts()).updateOne({ _id: id }, { $set: { txRef } });
}

export async function markCheckoutAttemptPaid(txRef: string) {
  if (!txRef) return;
  await (await checkoutAttempts()).updateOne({ txRef, status: "started" }, { $set: { status: "paid" } });
}

function requests() {
  return db().then((database) => database.collection<RequestDoc>("requests"));
}

function notes() {
  return db().then((database) => database.collection<NoteDoc>("notes"));
}

function idOf(value: string) {
  if (!ObjectId.isValid(value)) return null;
  return new ObjectId(value);
}

function sessionUser(user: UserDoc): SessionUser {
  return { id: user._id.toString(), email: user.email, name: user.name, role: user.role };
}

function priceOf(bay: BayDoc) {
  return bay.currency === "NGN" ? formatNaira(bay.amount) : formatPrice(bay.amount);
}

function summary(request: RequestDoc): RequestSummary {
  return {
    id: request._id.toString(),
    title: request.title,
    status: request.status,
    position: request.position,
    age: waited(request.updatedAt),
    brief: request.brief,
    linkCount: request.links.length,
    deliveryLink: request.deliveryLink ?? null,
  };
}

const emptyKit: BrandKitView = {
  fonts: "",
  colors: "",
  captionStyle: "",
  hook: "",
  cta: "",
  logo: "",
  music: "",
  references: "",
  complete: false,
};

function kitView(kit?: BrandKitDoc): BrandKitView {
  if (!kit?.completedAt || !kit.fonts || !kit.colors || !kit.captionStyle || !kit.hook || !kit.cta || !kit.logo || !kit.music || kit.references.length === 0) {
    return kit
      ? {
          fonts: kit.fonts,
          colors: kit.colors,
          captionStyle: kit.captionStyle,
          hook: kit.hook,
          cta: kit.cta,
          logo: kit.logo,
          music: kit.music,
          references: kit.references.join("\n"),
          complete: false,
        }
      : emptyKit;
  }
  return {
    fonts: kit.fonts,
    colors: kit.colors,
    captionStyle: kit.captionStyle,
    hook: kit.hook,
    cta: kit.cta,
    logo: kit.logo,
    music: kit.music,
    references: kit.references.join("\n"),
    complete: true,
  };
}

function bayView(bay: BayDoc, jobs: RequestDoc[], clientName: string): BayView {
  return {
    id: bay._id.toString(),
    clientName,
    planName: planName(bay.plan),
    price: priceOf(bay),
    brandKit: kitView(bay.brandKit),
    requests: jobs.map(summary),
  };
}

function waited(from: Date) {
  const minutes = Math.max(0, Math.floor((Date.now() - from.getTime()) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return hours === 1 ? "1 hour" : `${hours} hours`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "1 day" : `${days} days`;
}

export function parseLinks(raw: string): { ok: true; links: string[] } | { ok: false } {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length > 10) return { ok: false };
  const links: string[] = [];
  for (const line of lines) {
    try {
      const url = new URL(line);
      if (url.protocol !== "http:" && url.protocol !== "https:") return { ok: false };
      links.push(url.toString());
    } catch {
      return { ok: false };
    }
  }
  return { ok: true, links };
}

export async function findUserById(id: string) {
  const objectId = idOf(id);
  if (!objectId) return null;
  const user = await (await users()).findOne({ _id: objectId });
  return user ? sessionUser(user) : null;
}

export async function findUserRecord(email: string) {
  return (await users()).findOne({ email: email.trim().toLowerCase() });
}

export async function openBayFromCharge(charge: VerifiedCharge, transactionId = "") {
  if (!charge.email || !charge.txRef) return null;
  const collection = await users();
  const now = new Date();
  const existing = await collection.findOne({ email: charge.email });
  let user = existing;
  if (!user) {
    const inserted = await collection.insertOne({
      _id: new ObjectId(),
      email: charge.email,
      name: charge.name || charge.email,
      passwordHash: null,
      role: "client",
      createdAt: now,
    });
    user = await collection.findOne({ _id: inserted.insertedId });
  }
  if (!user) return null;
  const bayCollection = await bays();
  await bayCollection.updateOne(
    { txRef: charge.txRef },
    {
      $setOnInsert: {
        userId: user._id,
        plan: charge.plan,
        status: "active",
        currency: charge.currency,
        amount: charge.amount,
        txRef: charge.txRef,
        transactionId: transactionId || charge.txRef,
        createdAt: now,
      },
    },
    { upsert: true },
  );
  const bay = await bayCollection.findOne({ txRef: charge.txRef });
  if (!bay) return null;
  await markCheckoutAttemptPaid(charge.txRef).catch(() => undefined);
  let notified = Boolean(bay.notifiedAt);
  if (!notified) {
    const sent = await sendPaymentEmails(charge, transactionId || bay.transactionId).catch(() => false);
    if (sent) {
      await bayCollection.updateOne({ _id: bay._id, notifiedAt: { $exists: false } }, { $set: { notifiedAt: new Date() } });
      notified = true;
    }
  }
  return { hasPassword: Boolean(user.passwordHash), notified };
}

export async function setPasswordForEmail(email: string, password: string) {
  const collection = await users();
  const user = await collection.findOne({ email: email.trim().toLowerCase() });
  if (!user || user.passwordHash) return null;
  const passwordHash = await hashPassword(password);
  await collection.updateOne({ _id: user._id }, { $set: { passwordHash } });
  return sessionUser({ ...user, passwordHash });
}

export async function setupStaffAccount(email: string, password: string) {
  const collection = await users();
  const normalized = email.trim().toLowerCase();
  const existing = await collection.findOne({ email: normalized });
  if (existing?.passwordHash) return "exists" as const;
  const passwordHash = await hashPassword(password);
  if (existing) {
    await collection.updateOne({ _id: existing._id }, { $set: { passwordHash, role: "staff" } });
    return sessionUser({ ...existing, passwordHash, role: "staff" });
  }
  const inserted = await collection.insertOne({
    _id: new ObjectId(),
    email: normalized,
    name: normalized,
    passwordHash,
    role: "staff",
    createdAt: new Date(),
  });
  const user = await collection.findOne({ _id: inserted.insertedId });
  return user ? sessionUser(user) : null;
}

export async function baysFor(user: SessionUser): Promise<BayView[]> {
  const filter: Filter<BayDoc> = user.role === "staff" ? {} : { userId: idOf(user.id) ?? new ObjectId() };
  const bayCollection = await bays();
  const rows = await bayCollection.find(filter).sort({ createdAt: -1 }).toArray();
  const requestCollection = await requests();
  const views: BayView[] = [];
  for (const bay of rows) {
    const jobs = await requestCollection.find({ bayId: bay._id }).sort({ position: 1 }).toArray();
    views.push(bayView(bay, jobs, user.name));
  }
  return views;
}

export async function staffDesk(): Promise<{ queue: DeskItem[]; projects: ProjectItem[] }> {
  const bayRows = await (await bays()).find().sort({ createdAt: -1 }).toArray();
  const userCollection = await users();
  const owners = bayRows.length === 0 ? [] : await userCollection.find({ _id: { $in: bayRows.map((bay) => bay.userId) } }).toArray();
  const ownerById = new Map(owners.map((owner) => [owner._id.toString(), owner]));
  const open = await (await requests()).find({ status: { $in: ["queued", "active", "delivered"] } }).toArray();
  const queue: Array<DeskItem & { at: number }> = [];
  const projects: ProjectItem[] = [];

  for (const bay of bayRows) {
    const owner = ownerById.get(bay.userId.toString());
    const clientName = owner?.name || "Client";
    const mine = open.filter((job) => job.bayId.equals(bay._id));
    const active = mine.filter((job) => job.status === "active");
    const queued = mine.filter((job) => job.status === "queued").sort((a, b) => a.position - b.position);
    const delivered = mine.filter((job) => job.status === "delivered");
    const row = (job: RequestDoc, lane: DeskLane) => ({
      bayId: bay._id.toString(),
      requestId: job._id.toString(),
      clientName,
      planName: planName(bay.plan),
      title: job.title,
      age: waited(job.updatedAt),
      lane,
      at: job.updatedAt.getTime(),
    });
    for (const job of active) queue.push(row(job, "bench"));
    if (active.length === 0 && queued[0]) queue.push(row(queued[0], "start"));
    for (const job of delivered) queue.push(row(job, "client"));
    projects.push({
      id: bay._id.toString(),
      clientName,
      planName: planName(bay.plan),
      price: priceOf(bay),
      inMotion: active.length + queued.length + delivered.length > 0,
      queued: queued.length,
      bench: active.length,
      waiting: delivered.length,
      kitReady: kitView(bay.brandKit).complete,
    });
  }

  const order: DeskLane[] = ["bench", "start", "client"];
  queue.sort((a, b) => order.indexOf(a.lane) - order.indexOf(b.lane) || a.at - b.at);
  return {
    queue: queue.map((item) => ({
      bayId: item.bayId,
      requestId: item.requestId,
      clientName: item.clientName,
      planName: item.planName,
      title: item.title,
      age: item.age,
      lane: item.lane,
    })),
    projects,
  };
}

async function ownsBay(user: SessionUser, bayId: ObjectId) {
  if (user.role === "staff") return (await bays()).findOne({ _id: bayId });
  const ownerId = idOf(user.id);
  if (!ownerId) return null;
  return (await bays()).findOne({ _id: bayId, userId: ownerId });
}

export async function bayFor(user: SessionUser, bayId: string): Promise<BayView | null> {
  const objectId = idOf(bayId);
  if (!objectId) return null;
  const bay = await ownsBay(user, objectId);
  if (!bay) return null;
  const jobs = await (await requests()).find({ bayId: bay._id }).sort({ position: 1 }).toArray();
  const owner = await (await users()).findOne({ _id: bay.userId });
  return bayView(bay, jobs, owner?.name || "Client");
}

export async function requestFor(user: SessionUser, requestId: string): Promise<RequestDetail | null> {
  const objectId = idOf(requestId);
  if (!objectId) return null;
  const request = await (await requests()).findOne({ _id: objectId });
  if (!request) return null;
  const bay = await ownsBay(user, request.bayId);
  if (!bay) return null;
  const noteRows = await (await notes()).find({ requestId: request._id }).sort({ createdAt: 1 }).toArray();
  const userCollection = await users();
  const noteViews: NoteView[] = [];
  for (const note of noteRows) {
    const author = await userCollection.findOne({ _id: note.authorId });
    noteViews.push({
      id: note._id.toString(),
      author: author?.name || "Kinocut",
      body: note.body,
      at: note.createdAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
    });
  }
  const requestCollection = await requests();
  const active = await requestCollection.findOne({ bayId: request.bayId, status: "active" });
  const next = await requestCollection.find({ bayId: request.bayId, status: "queued" }).sort({ position: 1 }).limit(1).next();
  return {
    id: request._id.toString(),
    bayId: request.bayId.toString(),
    title: request.title,
    brief: request.brief,
    links: request.links,
    deliveryLink: request.deliveryLink ?? null,
    status: request.status,
    canStart: !active && next?._id.equals(request._id) === true,
    brandKit: kitView(bay.brandKit),
    notes: noteViews,
  };
}

export async function saveBrandKit(
  user: SessionUser,
  bayId: string,
  input: { fonts: string; colors: string; captionStyle: string; hook: string; cta: string; logo: string; music: string; references: string },
) {
  if (user.role !== "client") return false;
  const objectId = idOf(bayId);
  if (!objectId) return false;
  const bay = await ownsBay(user, objectId);
  if (!bay) return false;
  const text = (value: string, max: number) => value.trim().replace(/\s+/g, " ").slice(0, max);
  const fonts = text(input.fonts, 400);
  const colors = text(input.colors, 400);
  const captionStyle = text(input.captionStyle, 400);
  const hook = input.hook.trim().slice(0, 800);
  const cta = input.cta.trim().slice(0, 800);
  const logo = parseLinks(input.logo);
  const music = parseLinks(input.music);
  const references = parseLinks(input.references);
  if (!fonts || !colors || !captionStyle || !hook || !cta) return false;
  if (!logo.ok || logo.links.length !== 1 || !music.ok || music.links.length !== 1 || !references.ok || references.links.length < 1) return false;
  await (await bays()).updateOne(
    { _id: bay._id },
    {
      $set: {
        brandKit: {
          fonts,
          colors,
          captionStyle,
          hook,
          cta,
          logo: logo.links[0],
          music: music.links[0],
          references: references.links,
          completedAt: new Date(),
        },
      },
    },
  );
  return true;
}

export async function createQueuedRequest(user: SessionUser, bayId: string, title: string, brief: string, links: string[]) {
  if (user.role !== "client") return "bay" as const;
  const objectId = idOf(bayId);
  if (!objectId) return "bay" as const;
  const bay = await ownsBay(user, objectId);
  if (!bay) return "bay" as const;
  if (!kitView(bay.brandKit).complete) return "kit" as const;
  const collection = await requests();
  const last = await collection.find({ bayId: bay._id }).sort({ position: -1 }).limit(1).next();
  const now = new Date();
  await collection.insertOne({
    _id: new ObjectId(),
    bayId: bay._id,
    title,
    brief,
    links,
    status: "queued",
    position: (last?.position ?? 0) + 1,
    createdAt: now,
    updatedAt: now,
  });
  return "ok" as const;
}

export async function moveQueuedRequest(user: SessionUser, requestId: string, direction: "up" | "down") {
  if (user.role !== "client") return;
  const objectId = idOf(requestId);
  if (!objectId) return;
  const collection = await requests();
  const request = await collection.findOne({ _id: objectId, status: "queued" });
  if (!request || !(await ownsBay(user, request.bayId))) return;
  const neighbor = await collection
    .find(direction === "up" ? { bayId: request.bayId, status: "queued", position: { $lt: request.position } } : { bayId: request.bayId, status: "queued", position: { $gt: request.position } })
    .sort({ position: direction === "up" ? -1 : 1 })
    .limit(1)
    .next();
  if (!neighbor) return;
  const now = new Date();
  await collection.updateOne({ _id: request._id }, { $set: { position: neighbor.position, updatedAt: now } });
  await collection.updateOne({ _id: neighbor._id }, { $set: { position: request.position, updatedAt: now } });
}

export async function removeClientBay(user: SessionUser, bayId: string) {
  if (user.role !== "staff") return false;
  const objectId = idOf(bayId);
  if (!objectId) return false;
  const bayCollection = await bays();
  const bay = await bayCollection.findOne({ _id: objectId });
  if (!bay) return false;
  const requestCollection = await requests();
  const jobs = await requestCollection.find({ bayId: objectId }).project({ _id: 1 }).toArray();
  if (jobs.length) await (await notes()).deleteMany({ requestId: { $in: jobs.map((job) => job._id) } });
  await requestCollection.deleteMany({ bayId: objectId });
  await bayCollection.deleteOne({ _id: objectId });
  const remaining = await bayCollection.countDocuments({ userId: bay.userId });
  if (remaining === 0) await (await users()).deleteOne({ _id: bay.userId, role: "client" });
  return true;
}

export async function startNextRequest(user: SessionUser, bayId: string) {
  if (user.role !== "staff") return false;
  const objectId = idOf(bayId);
  if (!objectId || !(await ownsBay(user, objectId))) return false;
  const collection = await requests();
  const active = await collection.findOne({ bayId: objectId, status: "active" });
  if (active) return false;
  const next = await collection.find({ bayId: objectId, status: "queued" }).sort({ position: 1 }).limit(1).next();
  if (!next) return false;
  await collection.updateOne({ _id: next._id }, { $set: { status: "active", updatedAt: new Date() } });
  return true;
}

export async function deliverActiveRequest(user: SessionUser, bayId: string, deliveryLink: string) {
  if (user.role !== "staff") return false;
  const objectId = idOf(bayId);
  if (!objectId || !(await ownsBay(user, objectId))) return false;
  const parsed = parseLinks(deliveryLink);
  if (!parsed.ok || parsed.links.length !== 1) return false;
  const result = await (await requests()).updateOne(
    { bayId: objectId, status: "active" },
    { $set: { status: "delivered", deliveryLink: parsed.links[0], updatedAt: new Date() } },
  );
  return result.modifiedCount === 1;
}

export async function approveDeliveredRequest(user: SessionUser, requestId: string) {
  if (user.role !== "client") return false;
  const objectId = idOf(requestId);
  if (!objectId) return false;
  const collection = await requests();
  const request = await collection.findOne({ _id: objectId, status: "delivered" });
  if (!request || !(await ownsBay(user, request.bayId))) return false;
  await collection.updateOne({ _id: request._id }, { $set: { status: "approved", updatedAt: new Date() } });
  return true;
}

export async function addRequestNote(user: SessionUser, requestId: string, body: string) {
  const detail = await requestFor(user, requestId);
  const authorId = idOf(user.id);
  const requestObjectId = idOf(requestId);
  if (!detail || !authorId || !requestObjectId) return false;
  await (await notes()).insertOne({ _id: new ObjectId(), requestId: requestObjectId, authorId, body, createdAt: new Date() });
  return true;
}
