import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const salesData = [
  { month: "Jan", sales: 18500, orders: 320 },
  { month: "Feb", sales: 22300, orders: 376 },
  { month: "Mar", sales: 26700, orders: 421 },
  { month: "Apr", sales: 25100, orders: 398 },
  { month: "May", sales: 29400, orders: 463 },
  { month: "Jun", sales: 31800, orders: 501 },
];

const trafficData = [
  { name: "Organic", value: 44 },
  { name: "Social", value: 23 },
  { name: "Email", value: 19 },
  { name: "Ads", value: 14 },
];

const categoryData = [
  { category: "Shoes", value: 34 },
  { category: "Electronics", value: 26 },
  { category: "Clothing", value: 18 },
  { category: "Bags", value: 14 },
  { category: "Furniture", value: 8 },
];

export function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-xl border border-border bg-background p-4">
        <h1 className="text-lg font-semibold text-foreground">Analytics Dashboard</h1>
        <p className="text-sm text-muted-foreground">Business insights and performance metrics</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="mt-1 text-2xl font-bold text-foreground">$152,800</p>
              <p className="mt-1 text-xs font-semibold text-status-success">+12.4% from last month</p>
            </div>
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
              <p className="mt-1 text-2xl font-bold text-foreground">2,456</p>
              <p className="mt-1 text-xs font-semibold text-status-success">+8.1% from last month</p>
            </div>
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
              <p className="mt-1 text-2xl font-bold text-foreground">12,942</p>
              <p className="mt-1 text-xs font-semibold text-status-success">+5.9% from last month</p>
            </div>
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <Users className="h-4 w-4" />
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Products</p>
              <p className="mt-1 text-2xl font-bold text-foreground">1,246</p>
              <p className="mt-1 text-xs font-semibold text-status-success">+3.2% from last month</p>
            </div>
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <Package className="h-4 w-4" />
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Revenue Trend</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Last 6 months</span>
            </div>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-xl border border-border bg-background p-4">
          <h2 className="text-base font-semibold text-foreground">Traffic Sources</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "hsl(var(--primary))" : index === 1 ? "hsl(var(--status-info))" : index === 2 ? "hsl(var(--status-success))" : "hsl(var(--status-warning))"} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="rounded-xl border border-border bg-background p-4">
        <h2 className="text-base font-semibold text-foreground">Category Performance</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}