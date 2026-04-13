import { Search, User } from "lucide-react";

export function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/95 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Customer Management</h1>
          <p className="text-sm text-muted-foreground">Manage customer accounts and engagement metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search customers..."
              className="h-10 w-full rounded-lg border border-border bg-secondary pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            <User className="h-4 w-4" />
            Add Customer
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-border/70 bg-background/95 p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Joined</th>
                <th className="pb-3 font-medium">Orders</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/60 last:border-b-0">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Ariana Jones</p>
                      <p className="text-xs text-muted-foreground">Admin</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-muted-foreground">ariana@example.com</td>
                <td className="py-3 text-muted-foreground">2026-03-15</td>
                <td className="py-3 text-foreground">12</td>
                <td className="py-3">
                  <span className="rounded-full bg-status-success-soft px-2 py-1 text-xs font-medium text-status-success">
                    Active
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-secondary/80">
                    View
                  </button>
                </td>
              </tr>
              <tr className="border-b border-border/60 last:border-b-0">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Samiul Rahman</p>
                      <p className="text-xs text-muted-foreground">Customer</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-muted-foreground">samiul@example.com</td>
                <td className="py-3 text-muted-foreground">2026-03-22</td>
                <td className="py-3 text-foreground">8</td>
                <td className="py-3">
                  <span className="rounded-full bg-status-success-soft px-2 py-1 text-xs font-medium text-status-success">
                    Active
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-secondary/80">
                    View
                  </button>
                </td>
              </tr>
              <tr className="border-b border-border/60 last:border-b-0">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">David Miller</p>
                      <p className="text-xs text-muted-foreground">Customer</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-muted-foreground">david@example.com</td>
                <td className="py-3 text-muted-foreground">2026-04-01</td>
                <td className="py-3 text-foreground">3</td>
                <td className="py-3">
                  <span className="rounded-full bg-status-warning-soft px-2 py-1 text-xs font-medium text-status-warning">
                    Pending
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-secondary/80">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}