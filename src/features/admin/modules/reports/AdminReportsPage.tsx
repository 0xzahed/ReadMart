import { FileText, Download, Filter } from "lucide-react";

const salesReports = [
  { id: "SR-001", name: "Daily Sales Summary", period: "Today", status: "Generated", lastRun: "2026-04-09 08:30" },
  { id: "SR-002", name: "Weekly Sales Report", period: "This Week", status: "Scheduled", lastRun: "2026-04-08 18:00" },
  { id: "SR-003", name: "Monthly Sales Analysis", period: "This Month", status: "Scheduled", lastRun: "2026-04-01 00:00" },
  { id: "SR-004", name: "Top Selling Products", period: "Last 30 Days", status: "Generated", lastRun: "2026-04-09 07:15" },
  { id: "SR-005", name: "Customer Acquisition", period: "Last 90 Days", status: "Generated", lastRun: "2026-04-09 06:45" },
];

export function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">Generate and download detailed business reports</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            <FileText className="h-4 w-4" />
            Generate Report
          </button>
        </div>
      </header>

      <section className="rounded-xl border border-border bg-background p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-base font-semibold text-foreground">Available Reports</h2>
          <div className="mt-3 sm:mt-0 flex items-center gap-2">
            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter reports..."
                className="h-10 w-full rounded-lg border border-border bg-secondary pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary sm:w-64"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {salesReports.map((report) => (
            <article key={report.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border border-border bg-secondary/50 p-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{report.name}</h3>
                    <p className="text-sm text-muted-foreground">{report.period}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 sm:mt-0 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex h-2 w-2 rounded-full ${report.status === "Generated" ? "bg-status-success" : "bg-status-info"}`}></span>
                  <span className="text-sm font-medium text-foreground">{report.status}</span>
                </div>
                <span className="text-sm text-muted-foreground">{report.lastRun}</span>
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-secondary/80">
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-secondary/80">
                    View
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-background p-4">
        <h2 className="text-base font-semibold text-foreground mb-4">Custom Report Builder</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Report Type</label>
            <select className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary">
              <option>Sales Report</option>
              <option>Customer Report</option>
              <option>Inventory Report</option>
              <option>Marketing Report</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Date Range</label>
            <select className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Format</label>
            <select className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary">
              <option>PDF</option>
              <option>CSV</option>
              <option>Excel</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            <FileText className="h-4 w-4" />
            Generate Custom Report
          </button>
        </div>
      </section>
    </div>
  );
}