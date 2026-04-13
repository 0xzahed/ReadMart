import { Settings, Store, Globe, Mail, Shield } from "lucide-react";

export function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border/70 bg-background/95 p-5 shadow-sm">
        <h1 className="text-lg font-semibold text-foreground">Store Settings</h1>
        <p className="text-sm text-muted-foreground">Configure your store&apos;s appearance, behavior, and security</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-border/70 bg-background/95 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Store className="h-4 w-4" />
            </div>
            <h2 className="text-base font-semibold text-foreground">Store Information</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Store Name</label>
              <input
                type="text"
                defaultValue="ReadMart"
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Store Description</label>
              <textarea
                defaultValue="Your one-stop destination for all your shopping needs"
                rows={3}
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
              />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-border/70 bg-background/95 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Globe className="h-4 w-4" />
            </div>
            <h2 className="text-base font-semibold text-foreground">Localization</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Default Language</label>
              <select className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary">
                <option>English</option>
                <option>Bangla</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Default Currency</label>
              <select className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary">
                <option>USD ($)</option>
                <option>BDT (৳)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-border/70 bg-background/95 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Mail className="h-4 w-4" />
            </div>
            <h2 className="text-base font-semibold text-foreground">Contact Information</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
              <input
                type="email"
                defaultValue="support@readmart.com"
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
              <input
                type="tel"
                defaultValue="+880 1234 567890"
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Address</label>
              <textarea
                defaultValue="123 Main Street, Dhaka, Bangladesh"
                rows={2}
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
              />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-border/70 bg-background/95 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Shield className="h-4 w-4" />
            </div>
            <h2 className="text-base font-semibold text-foreground">Security Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-foreground">Two-Factor Authentication</label>
                <p className="text-sm text-muted-foreground">Require additional verification for admin access</p>
              </div>
              <button className="inline-flex h-6 w-11 items-center rounded-full bg-primary/10 p-1 transition-colors hover:bg-primary/20">
                <span className="h-4 w-4 rounded-full bg-primary transition-transform" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-foreground">Password Policy</label>
                <p className="text-sm text-muted-foreground">Enforce strong password requirements</p>
              </div>
              <button className="inline-flex h-6 w-11 items-center rounded-full bg-primary/10 p-1 transition-colors hover:bg-primary/20">
                <span className="h-4 w-4 rounded-full bg-primary transition-transform" />
              </button>
            </div>
          </div>
        </article>
      </section>

      <div className="flex justify-end">
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
          <Settings className="h-4 w-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}