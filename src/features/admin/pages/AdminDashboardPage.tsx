import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Area,
  AreaChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DollarSign, Package, ShoppingBag, Users } from "lucide-react";

const salesByMonth = [
  { month: "Jan", sales: 18500, orders: 320 },
  { month: "Feb", sales: 22300, orders: 376 },
  { month: "Mar", sales: 26700, orders: 421 },
  { month: "Apr", sales: 25100, orders: 398 },
  { month: "May", sales: 29400, orders: 463 },
  { month: "Jun", sales: 31800, orders: 501 },
];

const categorySales = [
  { category: "Shoes", value: 34 },
  { category: "Electronics", value: 26 },
  { category: "Clothing", value: 18 },
  { category: "Bags", value: 14 },
  { category: "Furniture", value: 8 },
];

const channelShare = [
  { name: "Organic", value: 44, color: "#ef4444" },
  { name: "Social", value: 23, color: "#0ea5e9" },
  { name: "Email", value: 19, color: "#22c55e" },
  { name: "Ads", value: 14, color: "#f59e0b" },
];

const stats = [
  {
    label: "Revenue",
    value: "$31,800",
    growth: "+12.4%",
    icon: DollarSign,
  },
  {
    label: "Orders",
    value: "501",
    growth: "+8.1%",
    icon: ShoppingBag,
  },
  {
    label: "Customers",
    value: "2,942",
    growth: "+5.9%",
    icon: Users,
  },
  {
    label: "Products",
    value: "126",
    growth: "+3.2%",
    icon: Package,
  },
];

export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <span className="rounded-md bg-primary/10 p-2 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold text-emerald-600">{stat.growth}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-4 xl:col-span-2">
          <h2 className="text-base font-semibold text-slate-900">Revenue Trend</h2>
          <p className="text-sm text-slate-500">Last six months performance overview</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesByMonth}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => {
                    const numeric = typeof value === "number" ? value : Number(value);
                    const safeValue = Number.isFinite(numeric) ? numeric : 0;
                    return [`$${safeValue.toLocaleString()}`, "Revenue"];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#salesGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-base font-semibold text-slate-900">Traffic Sources</h2>
          <p className="text-sm text-slate-500">Current acquisition split</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelShare}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={55}
                  paddingAngle={3}
                >
                  {channelShare.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => {
                    const numeric = typeof value === "number" ? value : Number(value);
                    const safeValue = Number.isFinite(numeric) ? numeric : 0;
                    return [`${safeValue}%`, "Share"];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-base font-semibold text-slate-900">Category Contribution</h2>
        <p className="text-sm text-slate-500">Sales share by product category</p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categorySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip
                formatter={(value) => {
                  const numeric = typeof value === "number" ? value : Number(value);
                  const safeValue = Number.isFinite(numeric) ? numeric : 0;
                  return [`${safeValue}%`, "Category Share"];
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}