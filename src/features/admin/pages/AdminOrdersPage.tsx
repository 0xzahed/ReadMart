import { CheckCircle2, Clock3, PackageCheck, Truck } from "lucide-react";

const orderSummary = [
  { label: "Processing", value: 32, icon: Clock3, color: "text-amber-600 bg-amber-100" },
  { label: "Shipped", value: 58, icon: Truck, color: "text-sky-600 bg-sky-100" },
  { label: "Delivered", value: 214, icon: PackageCheck, color: "text-emerald-600 bg-emerald-100" },
  { label: "Completed", value: 198, icon: CheckCircle2, color: "text-violet-600 bg-violet-100" },
];

const recentOrders = [
  { id: "RM-1048", customer: "Ariana Jones", total: "$249.99", status: "Processing", date: "2026-04-08" },
  { id: "RM-1047", customer: "Samiul Rahman", total: "$899.99", status: "Shipped", date: "2026-04-08" },
  { id: "RM-1046", customer: "David Miller", total: "$199.99", status: "Delivered", date: "2026-04-07" },
  { id: "RM-1045", customer: "Nusrat Jahan", total: "$129.99", status: "Completed", date: "2026-04-07" },
  { id: "RM-1044", customer: "Liam Wilson", total: "$459.99", status: "Processing", date: "2026-04-06" },
];

function badgeClass(status: string) {
  if (status === "Processing") return "bg-amber-100 text-amber-700";
  if (status === "Shipped") return "bg-sky-100 text-sky-700";
  if (status === "Delivered") return "bg-emerald-100 text-emerald-700";
  return "bg-violet-100 text-violet-700";
}

export function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-xl border border-slate-200 bg-white p-4">
        <h1 className="text-lg font-semibold text-slate-900">Order Management</h1>
        <p className="text-sm text-slate-500">Track and monitor order lifecycle across the store</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {orderSummary.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <span className={`rounded-md p-2 ${item.color}`}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">{item.value}</p>
            </article>
          );
        })}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-base font-semibold text-slate-900">Recent Orders</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="py-3 font-medium text-slate-900">{order.id}</td>
                  <td className="py-3 text-slate-600">{order.customer}</td>
                  <td className="py-3 text-slate-600">{order.date}</td>
                  <td className="py-3 font-medium text-slate-900">{order.total}</td>
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