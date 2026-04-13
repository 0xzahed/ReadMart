import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Explore", to: "/explore" },
  { label: "Cart", to: "/cart" },
];

const categoryLinks = [
  { label: "Shoes", to: "/explore?category=shoes" },
  { label: "Clothing", to: "/explore?category=clothing" },
  { label: "Electronics", to: "/explore?category=electronics" },
  { label: "Bags", to: "/explore?category=bags" },
];

const legalLinks = ["Terms", "Privacy", "Cookies"];

const socialLinks = [
  { label: "Facebook", icon: FaFacebookF, href: "#" },
  { label: "Instagram", icon: FaInstagram, href: "#" },
  { label: "Twitter", icon: FaTwitter, href: "#" },
];

const SiteFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-border bg-secondary/40 pb-20 lg:pb-0">
      <div className="container py-10 lg:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-primary">ReadMart</h3>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              Discover quality products with fast delivery, secure checkout, and a
              shopping experience built for modern readers.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Gulshan, Dhaka, Bangladesh
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                +880 1700-000000
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                support@readmart.com
              </p>
            </div>
          </section>

          <section>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              Categories
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {categoryLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              Follow Us
            </h4>
            <div className="mb-4 flex items-center gap-2">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground">
              Need help? Visit our support center for order, payment, and return
              assistance.
            </p>
          </section>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} ReadMart. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {legalLinks.map((item) => (
              <a key={item} href="#" className="transition-colors hover:text-primary">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;