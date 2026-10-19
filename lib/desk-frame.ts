import type { BayView, DeskItem, ProjectItem } from "@/lib/accounts";

export function isDeskPath(pathname: string) {
  return pathname === "/bay" || pathname.startsWith("/bay/") || pathname === "/bays" || pathname.startsWith("/bays/");
}

export type DeskCount = { label: string; value: string };
export type DeskLink = { href: string; label: string };

export function staffFrame(desk: { queue: DeskItem[]; projects: ProjectItem[] }) {
  const count = (lane: DeskItem["lane"]) => String(desk.queue.filter((item) => item.lane === lane).length);
  return {
    counts: [
      { label: "On the bench", value: count("bench") },
      { label: "Waiting to start", value: count("start") },
      { label: "Waiting on the client", value: count("client") },
      { label: "Projects", value: String(desk.projects.length) },
    ] satisfies DeskCount[],
    nav: [
      { href: "/bays", label: "The desk" },
      ...desk.projects.map((project) => ({ href: `/bays/${project.id}`, label: project.clientName })),
    ] satisfies DeskLink[],
  };
}

export function clientFrame(bays: BayView[]) {
  const requests = bays.flatMap((bay) => bay.requests);
  const kit = bays.length > 0 && bays.every((bay) => bay.brandKit.complete) ? "Ready" : "Needed";
  return {
    counts: [
      { label: "On the bench", value: String(requests.filter((request) => request.status === "active").length) },
      { label: "In the queue", value: String(requests.filter((request) => request.status === "queued").length) },
      { label: "Ready for approval", value: String(requests.filter((request) => request.status === "delivered").length) },
      { label: "Brand kit", value: kit },
    ] satisfies DeskCount[],
    nav: [
      { href: "/bay", label: "Your bay" },
      ...requests.map((request) => ({ href: `/bay/${request.id}`, label: request.title })),
    ] satisfies DeskLink[],
  };
}

export const emptyStaffFrame = staffFrame({ queue: [], projects: [] });
export const emptyClientFrame = clientFrame([]);
