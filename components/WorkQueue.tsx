import type { DeskItem, DeskLane, ProjectItem } from "@/lib/accounts";

const laneCopy: Record<DeskLane, { title: string; empty: string }> = {
  bench: { title: "On the bench", empty: "Nothing is on the bench." },
  start: { title: "Waiting to start", empty: "Nothing is waiting to start." },
  client: { title: "Waiting on the client", empty: "Nothing is waiting on a client." },
};

export function WorkQueue({ queue, projects }: { queue: DeskItem[]; projects: ProjectItem[] }) {
  const lanes: DeskLane[] = ["bench", "start", "client"];

  return (
    <div className="grid gap-4">
      {lanes.map((lane) => {
        const rows = queue.filter((item) => item.lane === lane);
        return (
          <section key={lane} className="rounded-panel bg-white p-6 text-ink shadow-card md:p-8">
            <h2 className="type-sub">{laneCopy[lane].title}</h2>
            {rows.length === 0 ? <p className="type-body mt-4 text-ink-600">{laneCopy[lane].empty}</p> : null}
            <ul className="mt-4 grid gap-3">
              {rows.map((item) => (
                <li key={item.requestId}>
                  <a className="block rounded-card border border-ink/10 px-4 py-3" href={`/bays/${item.bayId}/${item.requestId}`}>
                    <p className="type-micro text-blue-700">
                      {item.clientName} · {item.planName}
                    </p>
                    <p className="mt-1 font-medium">{item.title}</p>
                    <p className="type-body mt-1 text-ink-600">{item.age}</p>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      <section className="rounded-panel bg-white p-6 text-ink shadow-card md:p-8">
        <h2 className="type-sub">All projects</h2>
        {projects.length === 0 ? <p className="type-body mt-4 text-ink-600">No client bays yet.</p> : null}
        <ul className="mt-4 grid gap-3">
          {projects.map((project) => (
            <li key={project.id}>
              <a className="block rounded-card border border-ink/10 px-4 py-3" href={`/bays/${project.id}`}>
                <p className="type-micro text-blue-700">{project.planName}</p>
                <p className="mt-1 font-medium">{project.clientName}</p>
                <p className="type-body mt-1 text-ink-600">
                  {project.price}
                  {project.inMotion ? "" : " · Nothing in motion"}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
