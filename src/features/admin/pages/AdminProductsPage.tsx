import { Edit3, Plus, Search, Trash2 } from "lucide-react";

import { products } from "@/data/products";

export function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Product Management</h1>
          <p className="text-sm text-slate-500">Manage catalog entries and inventory status</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product name"
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-primary"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
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
                <tr key={product.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100 p-1">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-500">ID #{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 capitalize text-slate-600">{product.category}</td>
                  <td className="py-3 font-medium text-slate-900">${product.price}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="py-3 text-slate-600">{product.rating} / 5</td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button className="rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg border border-red-200 p-2 text-red-600 transition-colors hover:bg-red-50">
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