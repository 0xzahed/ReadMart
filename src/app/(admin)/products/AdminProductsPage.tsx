import Image from "next/image";
import { Edit3, Plus, Search, Trash2 } from "lucide-react";

import { products } from "@/data/products";

export function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/95 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Product Management</h1>
          <p className="text-sm text-muted-foreground">Manage catalog entries and inventory status</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </header>

      <section className="rounded-2xl border border-border/70 bg-background/95 p-5 shadow-sm">
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by product name"
            className="h-10 w-full rounded-lg border border-border bg-secondary pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Stock</th>
                <th className="pb-3 font-medium">Rating</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border/60 last:border-b-0">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-secondary p-1">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">ID #{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 capitalize text-muted-foreground">{product.category}</td>
                  <td className="py-3 font-medium text-foreground">${product.price}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-status-success-soft px-2 py-1 text-xs font-semibold text-status-success">
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">{product.rating} / 5</td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg border border-destructive/30 p-2 text-destructive transition-colors hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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