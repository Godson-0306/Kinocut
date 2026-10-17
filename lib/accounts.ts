import { ObjectId, type Filter } from "mongodb";
import { formatNaira, formatPrice } from "@/content/site";
import { planById, type PlanId, type VerifiedCharge } from "@/lib/billing";
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
};

type RequestDoc = {
  _id: ObjectId;
  bayId: ObjectId;
  title: string;
  brief: string;
  links: string[];
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
};

export type BayView = {
  id: string;
  planName: string;
  price: string;
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
  status: RequestStatus;
  notes: NoteView[];
};

function users() {
  return db().then((database) => database.collection<UserDoc>("users"));
}

function bays() {
  return db().then((database) => database.collection<BayDoc>("bays"));
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
  return { id: request._id.toString(), title: request.title, status: request.status, position: request.position };
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
    views.push({
      id: bay._id.toString(),
      planName: planById(bay.plan).name,
      price: priceOf(bay),
      requests: jobs.map(summary),
    });
  }
  return views;
}

export async function staffBayList() {
  const bayCollection = await bays();
  const rows = await bayCollection.find().sort({ createdAt: -1 }).toArray();
  const userCollection = await users();
  const requestCollection = await requests();
  const list = [];
  for (const bay of rows) {
    const owner = await userCollection.findOne({ _id: bay.userId });
    const active = await requestCollection.findOne({ bayId: bay._id, status: "active" });
    list.push({
      id: bay._id.toString(),
      clientName: owner?.name || "Client",
      email: owner?.email || "",
      planName: planById(bay.plan).name,
      price: priceOf(bay),
      activeTitle: active?.title ?? null,
    });
  }
  return list;
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
  return { id: bay._id.toString(), planName: planById(bay.plan).name, price: priceOf(bay), requests: jobs.map(summary) };
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
  return {
    id: request._id.toString(),
    bayId: request.bayId.toString(),
    title: request.title,
    brief: request.brief,
    links: request.links,
    status: request.status,
    notes: noteViews,
  };
}

export async function createQueuedRequest(user: SessionUser, bayId: string, title: string, brief: string, links: string[]) {
  if (user.role !== "client") return false;
  const objectId = idOf(bayId);
  if (!objectId) return false;
  const bay = await ownsBay(user, objectId);
  if (!bay) return false;
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
  return true;
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

export async function deliverActiveRequest(user: SessionUser, bayId: string) {
  if (user.role !== "staff") return false;
  const objectId = idOf(bayId);
  if (!objectId || !(await ownsBay(user, objectId))) return false;
  const result = await (await requests()).updateOne({ bayId: objectId, status: "active" }, { $set: { status: "delivered", updatedAt: new Date() } });
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
