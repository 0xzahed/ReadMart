import { CheckCircle2, Clock3, PackageCheck, Truck } from "lucide-react";

const orderSummary = [
  { label: "Processing", value: 32, icon: Clock3, color: "text-status-warning bg-status-warning-soft" },
  { label: "Shipped", value: 58, icon: Truck, color: "text-status-info bg-status-info-soft" },
  { label: "Delivered", value: 214, icon: PackageCheck, color: "text-status-success bg-status-success-soft" },
  { label: "Completed", value: 198, icon: CheckCircle2, color: "text-status-complete bg-status-complete-soft" },
];

const recentOrders = [
  { id: "RM-1048", customer: "Ariana Jones", total: "$249.99", status: "Processing", date: "2026-04-08" },
  { id: "RM-1047", customer: "Samiul Rahman", total: "$899.99", status: "Shipped", date: "2026-04-08" },
  { id: "RM-1046", customer: "David Miller", total: "$199.99", status: "Delivered", date: "2026-04-07" },
  { id: "RM-1045", customer: "Nusrat Jahan", total: "$129.99", status: "Completed", date: "2026-04-07" },
  { id: "RM-1044", customer: "Liam Wilson", total: "$459.99", status: "Processing", date: "2026-04-06" },
];

function badgeClass(status: string) {
  if (status === "Processing") return "bg-status-warning-soft text-status-warning";
  if (status === "Shipped") return "bg-status-info-soft text-status-info";
  if (status === "Delivered") return "bg-status-success-soft text-status-success";
  return "bg-status-complete-soft text-status-complete";
}

export function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-xl border border-border bg-background p-4">
        <h1 className="text-lg font-semibold text-foreground">Order Management</h1>
        <p className="text-sm text-muted-foreground">Track and monitor order lifecycle across the store</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {orderSummary.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label} className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                <span className={`rounded-md p-2 ${item.color}`}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-foreground">{item.value}</p>
            </article>
          );
        })}
      </section>

      <section className="rounded-xl border border-border bg-background p-4">
        <h2 className="text-base font-semibold text-foreground">Recent Orders</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border/60 last:border-b-0">
                  <td className="py-3 font-medium text-foreground">{order.id}</td>
                  <td className="py-3 text-muted-foreground">{order.customer}</td>
                  <td className="py-3 text-muted-foreground">{order.date}</td>
                  <td className="py-3 font-medium text-foreground">{order.total}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${badgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}