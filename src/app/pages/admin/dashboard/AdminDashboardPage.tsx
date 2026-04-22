"use client";

import { useState, type ChangeEvent } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Menu,
  Search,
  DollarSign,
  Layers,
  Clock3,
  CheckCircle2,
  Ban,
} from "lucide-react";
import { useStore, Slider, Category, Product, PromoCode, FlashDeal, Order } from "@/contexts/StoreContext";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { SectionHeading } from "@/components/admin/SectionHeading";
import { MetricCard } from "@/components/admin/MetricCard";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const readImageAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read image"));
    reader.readAsDataURL(file);
  });
};

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

const orderStatusOptions: Order["status"][] = ["pending", "confirmed", "cancelled", "delivered"];

const statusBadgeClass = (status: Order["status"]) => {
  if (status === "pending") return "bg-amber-100 text-amber-700";
  if (status === "confirmed") return "bg-blue-100 text-blue-700";
  if (status === "delivered") return "bg-emerald-100 text-emerald-700";
  return "bg-rose-100 text-rose-700";
};

// Slider Management Component
function SliderManagement() {
  const { sliders, addSlider, updateSlider, deleteSlider } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    subtitle: "",
    buttonText: "Shop Now",
    buttonLink: "",
    isActive: true,
  });

  const handleOpenModal = (slider?: Slider) => {
    if (slider) {
      setEditingSlider(slider);
      setFormData({
        image: slider.image,
        title: slider.title,
        subtitle: slider.subtitle || "",
        buttonText: slider.buttonText,
        buttonLink: slider.buttonLink,
        isActive: slider.isActive,
      });
    } else {
      setEditingSlider(null);
      setFormData({
        image: "",
        title: "",
        subtitle: "",
        buttonText: "Shop Now",
        buttonLink: "",
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleSliderImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageData = await readImageAsDataUrl(file);
      setFormData((prev) => ({ ...prev, image: imageData }));
    } catch {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image || !formData.title || !formData.buttonLink) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (editingSlider) {
      updateSlider(editingSlider.id, formData);
      toast.success("Slider updated successfully");
    } else {
      addSlider(formData);
      toast.success("Slider added successfully");
    }
    setShowModal(false);
  };

  return (
    <div>
      <SectionHeading
        title="Sliders"
        action={(
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Slider
          </button>
        )}
      />
      <div className="space-y-3">
        {sliders.map((slider) => (
          <div key={slider.id} className="bg-card rounded-lg p-4 flex items-center gap-4">
            <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded bg-secondary">
              <Image src={slider.image} alt={slider.title} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{slider.title}</h3>
              <p className="text-xs text-muted-foreground">{slider.buttonLink}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleOpenModal(slider)} className="p-2 hover:bg-secondary rounded">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => deleteSlider(slider.id)} className="p-2 hover:bg-secondary rounded text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editingSlider ? "Edit" : "Add"} Slider</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Slider Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSliderImageUpload}
                  className="w-full rounded-lg bg-secondary px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-foreground"
                />
                {formData.image && (
                  <div className="relative mt-2 h-32 w-full overflow-hidden rounded-lg bg-secondary">
                    <Image
                      src={formData.image}
                      alt="Slider preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                )}
                <p className="mt-1 text-xs text-muted-foreground">Recommended size: 1920x1080 (16:9)</p>
              </div>
              <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 bg-secondary rounded-lg" required />
              <input type="text" placeholder="Subtitle" value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="w-full px-3 py-2 bg-secondary rounded-lg" />
              <input type="text" placeholder="Button Text" value={formData.buttonText} onChange={(e) => setFormData({...formData, buttonText: e.target.value})} className="w-full px-3 py-2 bg-secondary rounded-lg" required />
              <input type="text" placeholder="Button Link" value={formData.buttonLink} onChange={(e) => setFormData({...formData, buttonLink: e.target.value})} className="w-full px-3 py-2 bg-secondary rounded-lg" required />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4"
                />
                Active slider
              </label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 bg-secondary rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg">{editingSlider ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Category Management Component
function CategoryManagement() {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchText, setSearchText] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    link: "",
    subcategoriesText: "",
    isActive: true,
  });

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        image: category.image,
        link: category.link || "",
        subcategoriesText: (category.subcategories || []).join(", "),
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", image: "", link: "", subcategoriesText: "", isActive: true });
    }
    setShowModal(true);
  };

  const handleCategoryImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageData = await readImageAsDataUrl(file);
      setFormData((prev) => ({ ...prev, image: imageData }));
    } catch {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.image) {
      toast.error("Please fill in required fields");
      return;
    }
    const subcategories = formData.subcategoriesText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      name: formData.name,
      image: formData.image,
      link: formData.link,
      subcategories,
      isActive: formData.isActive,
    };

    if (editingCategory) {
      updateCategory(editingCategory.id, payload);
      toast.success("Category updated");
    } else {
      addCategory(payload);
      toast.success("Category added");
    }
    setShowModal(false);
  };

  const filteredCategories = categories.filter((category) => {
    if (!searchText.trim()) return true;

    const keyword = searchText.toLowerCase();
    return (
      category.name.toLowerCase().includes(keyword) ||
      (category.subcategories || []).some((subcategory) => subcategory.toLowerCase().includes(keyword))
    );
  });

  return (
    <div>
      <SectionHeading
        title="Categories"
        action={(
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />Add Category
          </button>
        )}
      />

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative mb-4 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search category"
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:border-primary"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-180 text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                <th className="pb-3 font-medium">Image</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Subcategories</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id} className="border-b border-gray-100 last:border-b-0">
                  <td className="py-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-md bg-gray-100">
                      <Image src={category.image} alt={category.name} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="py-3 font-medium text-gray-900">{category.name}</td>
                  <td className="py-3 text-gray-600">
                    {(category.subcategories || []).length > 0 ? (category.subcategories || []).join(", ") : "-"}
                  </td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        category.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(category)}
                        className="rounded-md border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="rounded-md border border-rose-200 p-2 text-rose-500 transition-colors hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCategories.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">No category matched your search.</p>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editingCategory ? "Edit" : "Add"} Category</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-secondary rounded-lg" required />
              <div>
                <label className="mb-1 block text-sm font-medium">Category Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCategoryImageUpload}
                  className="w-full rounded-lg bg-secondary px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-foreground"
                />
                {formData.image && (
                  <div className="relative mt-2 h-32 w-full overflow-hidden rounded-lg bg-secondary">
                    <Image
                      src={formData.image}
                      alt="Category preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
              <input type="text" placeholder="Link (optional)" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} className="w-full px-3 py-2 bg-secondary rounded-lg" />
              <input
                type="text"
                placeholder="Subcategories (comma separated)"
                value={formData.subcategoriesText}
                onChange={(e) => setFormData({ ...formData, subcategoriesText: e.target.value })}
                className="w-full px-3 py-2 bg-secondary rounded-lg"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4"
                />
                Active category
              </label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 bg-secondary rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg">{editingCategory ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Product Management Component
function ProductManagement() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [formData, setFormData] = useState({
    name: "", price: 0, originalPrice: 0, images: [""], category: "",
    brand: "", rating: 0, reviews: "", description: "", colors: [""],
    barcode: "", subcategory: "", inStock: true, isFlashDeal: false, discountPercent: 0,
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name, price: product.price, originalPrice: product.originalPrice,
        images: product.images, category: product.category, brand: product.brand || "",
        rating: product.rating, reviews: product.reviews ? String(product.reviews) : "", description: product.description,
        colors: product.colors, barcode: product.barcode || "", subcategory: product.subcategory || "", inStock: product.inStock,
        isFlashDeal: product.isFlashDeal, discountPercent: product.discountPercent,
      });
    } else {
      setEditingProduct(null);
      const defaultCategoryId = categories[0]?.id || "";
      const defaultSubcategory = categories.find((category) => category.id === defaultCategoryId)?.subcategories?.[0] || "";
      setFormData({
        name: "", price: 0, originalPrice: 0, images: [""], category: defaultCategoryId,
        brand: "", rating: 0, reviews: "", description: "", colors: [""],
        barcode: "", subcategory: defaultSubcategory, inStock: true, isFlashDeal: false, discountPercent: 0,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanImage = formData.images[0]?.trim();
    const cleanColors = formData.colors.map((color) => color.trim()).filter(Boolean);

    if (!formData.name || !formData.category || !cleanImage) {
      toast.error("Please fill in required fields");
      return;
    }

    const payload = {
      ...formData,
      images: [cleanImage],
      colors: cleanColors.length > 0 ? cleanColors : ["Default"],
      subcategory: formData.subcategory || undefined,
      reviews: formData.reviews.trim() ? Number(formData.reviews) : undefined,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      toast.success("Product updated");
    } else {
      addProduct(payload);
      toast.success("Product added");
    }
    setShowModal(false);
  };

  const handleProductImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageData = await readImageAsDataUrl(file);
      setFormData((prev) => ({ ...prev, images: [imageData] }));
    } catch {
      toast.error("Image upload failed");
    }
  };

  const addColor = () => setFormData({...formData, colors: [...formData.colors, ""]});
  const removeColor = (index: number) => setFormData({...formData, colors: formData.colors.filter((_, i) => i !== index)});
  const selectedCategory = categories.find((category) => category.id === formData.category);
  const availableSubcategories = selectedCategory?.subcategories || [];

  const handleCategoryChange = (value: string) => {
    const nextCategory = categories.find((category) => category.id === value);
    const defaultSubcategory = nextCategory?.subcategories?.[0] || "";
    setFormData({
      ...formData,
      category: value,
      subcategory: defaultSubcategory,
    });
  };

  const updateColor = (index: number, value: string) => {
    const newColors = [...formData.colors];
    newColors[index] = value;
    setFormData({...formData, colors: newColors});
  };

  const filteredProducts = products.filter((product) => {
    const categoryMatched = categoryFilter === "all" || product.category === categoryFilter;
    if (!categoryMatched) return false;

    if (!searchText.trim()) return true;
    const keyword = searchText.toLowerCase();
    return (
      product.name.toLowerCase().includes(keyword) ||
      (product.brand || "").toLowerCase().includes(keyword) ||
      (product.subcategory || "").toLowerCase().includes(keyword)
    );
  });

  return (
    <div>
      <SectionHeading
        title="Products"
        action={(
          <button onClick={() => handleOpenModal()} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90">
            <Plus className="h-4 w-4" />Add Product
          </button>
        )}
      />

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>

          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search product"
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:border-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-215 text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Stock</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const category = categories.find((item) => item.id === product.category);

                return (
                  <tr key={product.id} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 overflow-hidden rounded-md bg-gray-100">
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.subcategory || product.brand || "-"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-gray-600">{category?.name || "Unknown"}</td>
                    <td className="py-3 font-medium text-gray-900">{formatCurrency(product.price)}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${product.inStock ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                        {product.inStock ? "In stock" : "Out of stock"}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${product.isFlashDeal ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
                        {product.isFlashDeal ? "Flash deal" : "Regular"}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal(product)} className="rounded-md border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50"><Edit2 className="h-4 w-4" /></button>
                        <button onClick={() => deleteProduct(product.id)} className="rounded-md border border-rose-200 p-2 text-rose-500 transition-colors hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">No product matched your filters.</p>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editingProduct ? "Edit" : "Add"} Product</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-secondary rounded-lg" required />
              <div>
                <label className="mb-1 block text-sm font-medium">Primary Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProductImageUpload}
                  className="w-full rounded-lg bg-secondary px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-foreground"
                />
                {formData.images[0] && (
                  <div className="relative mt-2 h-36 w-full overflow-hidden rounded-lg bg-secondary">
                    <Image
                      src={formData.images[0]}
                      alt="Product preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" step="0.01" placeholder="Price" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="w-full px-3 py-2 bg-secondary rounded-lg" required />
                <input type="number" step="0.01" placeholder="Original Price" value={formData.originalPrice} onChange={(e) => setFormData({...formData, originalPrice: Number(e.target.value)})} className="w-full px-3 py-2 bg-secondary rounded-lg" />
              </div>
              <select value={formData.category} onChange={(e) => handleCategoryChange(e.target.value)} className="w-full px-3 py-2 bg-secondary rounded-lg" required>
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {availableSubcategories.length > 0 && (
                <select
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary rounded-lg"
                >
                  <option value="">Select Subcategory (optional)</option>
                  {availableSubcategories.map((subcategory) => (
                    <option key={subcategory} value={subcategory}>{subcategory}</option>
                  ))}
                </select>
              )}
              <input type="text" placeholder="Brand (optional)" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} className="w-full px-3 py-2 bg-secondary rounded-lg" />
              <input type="number" min="0" step="1" placeholder="Reviews count (optional)" value={formData.reviews} onChange={(e) => setFormData({...formData, reviews: e.target.value})} className="w-full px-3 py-2 bg-secondary rounded-lg" />
              <input type="text" placeholder="Barcode (optional)" value={formData.barcode} onChange={(e) => setFormData({...formData, barcode: e.target.value})} className="w-full px-3 py-2 bg-secondary rounded-lg" />
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 bg-secondary rounded-lg resize-none" rows={3} />
              
              <div>
                <label className="block text-sm font-medium mb-2">Colors</label>
                {formData.colors.map((color, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input type="text" placeholder="Color name" value={color} onChange={(e) => updateColor(index, e.target.value)} className="flex-1 px-3 py-2 bg-secondary rounded-lg" />
                    {formData.colors.length > 1 && <button type="button" onClick={() => removeColor(index)} className="p-2 text-destructive"><X className="w-4 h-4" /></button>}
                  </div>
                ))}
                <button type="button" onClick={addColor} className="text-sm text-primary">+ Add Color</button>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.inStock} onChange={(e) => setFormData({...formData, inStock: e.target.checked})} className="w-4 h-4" /> In Stock</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isFlashDeal} onChange={(e) => setFormData({...formData, isFlashDeal: e.target.checked})} className="w-4 h-4" /> Flash Deal</label>
              </div>
              <input type="number" placeholder="Discount %" value={formData.discountPercent} onChange={(e) => setFormData({...formData, discountPercent: Number(e.target.value)})} className="w-full px-3 py-2 bg-secondary rounded-lg" />

              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 bg-secondary rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg">{editingProduct ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersManagement({
  title = "Orders",
  initialStatus = "all",
}: {
  title?: string;
  initialStatus?: Order["status"] | "all";
}) {
  const { orders, updateOrderStatus } = useStore();
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">(initialStatus);
  const [searchText, setSearchText] = useState("");

  const filteredOrders = orders.filter((order) => {
    const statusMatched = statusFilter === "all" || order.status === statusFilter;
    if (!statusMatched) return false;

    if (!searchText.trim()) return true;
    const keyword = searchText.toLowerCase();
    return (
      order.id.toLowerCase().includes(keyword) ||
      order.customerName.toLowerCase().includes(keyword) ||
      order.customerPhone.toLowerCase().includes(keyword) ||
      order.customerAddress.toLowerCase().includes(keyword)
    );
  });

  const pendingCount = orders.filter((order) => order.status === "pending").length;
  const confirmedCount = orders.filter((order) => order.status === "confirmed").length;
  const deliveredCount = orders.filter((order) => order.status === "delivered").length;
  const cancelledCount = orders.filter((order) => order.status === "cancelled").length;

  return (
    <div className="space-y-4">
      <SectionHeading title={title} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{pendingCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Confirmed</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">{confirmedCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Delivered</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{deliveredCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Cancelled</p>
          <p className="mt-1 text-2xl font-bold text-rose-600">{cancelledCount}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as Order["status"] | "all")}
            className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none"
          >
            <option value="all">All Status</option>
            {orderStatusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search by name / phone / address"
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:border-primary"
            />
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-500">No orders matched your filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-245 text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Address</th>
                  <th className="pb-3 font-medium">Phone</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-3 font-medium text-gray-900">{order.id}</td>
                    <td className="py-3 text-gray-700">{order.customerName}</td>
                    <td className="py-3 text-gray-600">{order.customerAddress}</td>
                    <td className="py-3 text-gray-700">{order.customerPhone}</td>
                    <td className="py-3 text-gray-600">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="py-3 font-medium text-gray-900">{formatCurrency(order.total)}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                        <select
                          value={order.status}
                          onChange={(event) => updateOrderStatus(order.id, event.target.value as Order["status"])}
                          className="h-8 rounded-md border border-gray-200 bg-gray-50 px-2 text-xs text-gray-700 outline-none"
                        >
                          {orderStatusOptions.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function CustomersManagement({ title = "Customers" }: { title?: string }) {
  const { orders } = useStore();
  const [searchText, setSearchText] = useState("");

  const customerMap = orders.reduce<Record<string, { name: string; phone: string; address: string; orders: number; total: number }>>(
    (acc, order) => {
      const key = order.customerPhone;
      if (!acc[key]) {
        acc[key] = {
          name: order.customerName,
          phone: order.customerPhone,
          address: order.customerAddress,
          orders: 0,
          total: 0,
        };
      }

      acc[key].orders += 1;
      acc[key].total += order.total;

      return acc;
    },
    {}
  );

  const customers = Object.values(customerMap).sort((a, b) => b.orders - a.orders);
  const filteredCustomers = customers.filter((customer) => {
    if (!searchText.trim()) return true;
    const keyword = searchText.toLowerCase();
    return (
      customer.name.toLowerCase().includes(keyword) ||
      customer.phone.toLowerCase().includes(keyword) ||
      customer.address.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="space-y-4">
      <SectionHeading title={title} />

      {customers.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">No customers yet</div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="relative mb-4 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search customer"
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:border-primary"
            />
          </div>

          {filteredCustomers.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">No customer matched your search.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-215 text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Phone</th>
                    <th className="pb-3 font-medium">Address</th>
                    <th className="pb-3 font-medium">Total Orders</th>
                    <th className="pb-3 font-medium">Total Spend</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.phone} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-3 font-medium text-gray-900">{customer.name}</td>
                      <td className="py-3 text-gray-700">{customer.phone}</td>
                      <td className="py-3 text-gray-600">{customer.address}</td>
                      <td className="py-3 text-gray-700">{customer.orders}</td>
                      <td className="py-3 font-medium text-gray-900">{formatCurrency(customer.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AnalyticsManagement() {
  const { orders, products, categories } = useStore();

  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter((order) => order.status === "pending").length;
  const confirmedOrders = orders.filter((order) => order.status === "confirmed").length;
  const deliveredOrders = orders.filter((order) => order.status === "delivered").length;
  const cancelledOrders = orders.filter((order) => order.status === "cancelled").length;

  const categoryStats = categories
    .map((category) => ({
      id: category.id,
      name: category.name,
      count: products.filter((product) => product.category === category.id).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const orderByWeekday = weekdayLabels.map((label, index) => {
    const ordersCount = orders.filter((order) => new Date(order.createdAt).getDay() === index).length;
    return {
      day: label,
      orders: ordersCount,
    };
  });

  const statusDistribution = [
    { name: "Pending", value: pendingOrders, color: "#f59e0b" },
    { name: "Confirmed", value: confirmedOrders, color: "#3b82f6" },
    { name: "Delivered", value: deliveredOrders, color: "#10b981" },
    { name: "Cancelled", value: cancelledOrders, color: "#f43f5e" },
  ].filter((entry) => entry.value > 0);

  return (
    <div className="space-y-4">
      <SectionHeading title="Analytics" />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(revenue)}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Orders</p>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{orders.length}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Products</p>
            <Package className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{products.length}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Categories</p>
            <Layers className="h-4 w-4 text-purple-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{categories.length}</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Orders by Weekday</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderByWeekday}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                <YAxis allowDecimals={false} stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Order Status Split</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={82}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Top Categories by Product Count</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={categoryStats.map((category) => ({
                category: category.name,
                products: category.count,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="category" stroke="#6b7280" fontSize={12} />
              <YAxis allowDecimals={false} stroke="#6b7280" fontSize={12} />
              <Tooltip />
              <Line dataKey="products" type="monotone" stroke="#14b8a6" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ReportsManagement() {
  const { orders, products, categories, promoCodes } = useStore();

  const downloadJson = (filename: string, data: unknown) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <SectionHeading title="Reports" />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <button
          onClick={() => downloadJson("orders-report.json", orders)}
          className="rounded-xl bg-card p-4 text-left transition-colors hover:bg-secondary"
        >
          <p className="font-semibold">Orders Report</p>
          <p className="mt-1 text-xs text-muted-foreground">Download all orders as JSON</p>
        </button>
        <button
          onClick={() => downloadJson("products-report.json", products)}
          className="rounded-xl bg-card p-4 text-left transition-colors hover:bg-secondary"
        >
          <p className="font-semibold">Products Report</p>
          <p className="mt-1 text-xs text-muted-foreground">Download all products as JSON</p>
        </button>
        <button
          onClick={() => downloadJson("categories-report.json", categories)}
          className="rounded-xl bg-card p-4 text-left transition-colors hover:bg-secondary"
        >
          <p className="font-semibold">Categories Report</p>
          <p className="mt-1 text-xs text-muted-foreground">Download all categories as JSON</p>
        </button>
        <button
          onClick={() => downloadJson("promo-codes-report.json", promoCodes)}
          className="rounded-xl bg-card p-4 text-left transition-colors hover:bg-secondary"
        >
          <p className="font-semibold">Promo Codes Report</p>
          <p className="mt-1 text-xs text-muted-foreground">Download all promo codes as JSON</p>
        </button>
      </div>
    </div>
  );
}

// Flash Deal Management
function FlashDealManagement() {
  const { flashDeal, updateFlashDeal } = useStore();
  const [formData, setFormData] = useState<FlashDeal>({
    id: flashDeal?.id || "1",
    endTime: flashDeal?.endTime || "",
    isActive: flashDeal?.isActive ?? true,
    backgroundImage: flashDeal?.backgroundImage || "",
  });

  const handleBackgroundImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageData = await readImageAsDataUrl(file);
      setFormData((prev) => ({ ...prev, backgroundImage: imageData }));
    } catch {
      toast.error("Image upload failed");
    }
  };

  const handleSave = () => {
    const finalEndTime = formData.endTime || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    updateFlashDeal({ ...formData, endTime: finalEndTime });
    toast.success("Flash deal updated");
  };

  const localDateTime = formData.endTime
    ? new Date(formData.endTime).toISOString().slice(0, 16)
    : "";

  return (
    <div>
      <SectionHeading title="Flash Deals" />

      <div className="space-y-4 rounded-xl bg-card p-5">
        <label className="block text-sm font-medium">Countdown End Time</label>
        <input
          type="datetime-local"
          value={localDateTime}
          onChange={(e) =>
            setFormData({
              ...formData,
              endTime: new Date(e.target.value).toISOString(),
            })
          }
          className="w-full rounded-lg bg-secondary px-3 py-2"
        />

        <label className="block text-sm font-medium">Header Background Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleBackgroundImageUpload}
          className="w-full rounded-lg bg-secondary px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-foreground"
        />
        {formData.backgroundImage && (
          <div className="space-y-2">
            <div className="relative h-36 w-full overflow-hidden rounded-lg bg-secondary">
              <Image
                src={formData.backgroundImage}
                alt="Flash deal background preview"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, backgroundImage: "" }))}
              className="text-sm font-medium text-destructive"
            >
              Remove Background Image
            </button>
          </div>
        )}

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="h-4 w-4"
          />
          Enable flash deals section
        </label>

        <button
          onClick={handleSave}
          className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Save Flash Deal
        </button>
      </div>
    </div>
  );
}

// Promo Code Management
function PromoCodeManagement() {
  const { promoCodes, addPromoCode, updatePromoCode, deletePromoCode } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [formData, setFormData] = useState({ code: "", discountPercent: 0, isActive: true, expiryDate: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.discountPercent) {
      toast.error("Please fill in required fields");
      return;
    }
    if (editingPromo) {
      updatePromoCode(editingPromo.id, formData);
      toast.success("Promo code updated");
    } else {
      addPromoCode(formData);
      toast.success("Promo code added");
    }
    setShowModal(false);
  };

  return (
    <div>
      <SectionHeading
        title="Promo Codes"
        action={(
          <button onClick={() => { setEditingPromo(null); setFormData({ code: "", discountPercent: 0, isActive: true, expiryDate: "" }); setShowModal(true); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm">
            <Plus className="w-4 h-4" />Add Code
          </button>
        )}
      />
      <div className="space-y-3">
        {promoCodes.map((promo) => (
          <div key={promo.id} className="bg-card rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 className="font-mono font-bold">{promo.code}</h3>
              <p className="text-sm text-muted-foreground">{promo.discountPercent}% discount</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingPromo(promo); setFormData({ code: promo.code, discountPercent: promo.discountPercent, isActive: promo.isActive, expiryDate: promo.expiryDate || "" }); setShowModal(true); }} className="p-2 hover:bg-secondary rounded"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => deletePromoCode(promo.id)} className="p-2 hover:bg-secondary rounded text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editingPromo ? "Edit" : "Add"} Promo Code</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Code (e.g., SAVE10)" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full px-3 py-2 bg-secondary rounded-lg font-mono" required />
              <input type="number" placeholder="Discount %" value={formData.discountPercent} onChange={(e) => setFormData({...formData, discountPercent: Number(e.target.value)})} className="w-full px-3 py-2 bg-secondary rounded-lg" required />
              <input type="date" value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} className="w-full px-3 py-2 bg-secondary rounded-lg" />
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4" /> Active</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 bg-secondary rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg">{editingPromo ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Settings Component
function SettingsManagement() {
  const { deliveryCharge, setDeliveryCharge, freeDeliveryThreshold, setFreeDeliveryThreshold } = useStore();
  const [localDelivery, setLocalDelivery] = useState(deliveryCharge);
  const [localThreshold, setLocalThreshold] = useState(freeDeliveryThreshold);

  const handleSave = () => {
    setDeliveryCharge(localDelivery);
    setFreeDeliveryThreshold(localThreshold);
    toast.success("Settings saved");
  };

  return (
    <div>
      <SectionHeading title="Settings" />
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Delivery Charge ($)</label>
          <input type="number" value={localDelivery} onChange={(e) => setLocalDelivery(parseFloat(e.target.value))} className="w-full px-3 py-2 bg-secondary rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Free Delivery Threshold ($)</label>
          <input type="number" value={localThreshold} onChange={(e) => setLocalThreshold(parseFloat(e.target.value))} className="w-full px-3 py-2 bg-secondary rounded-lg" />
        </div>
        <button onClick={handleSave} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">Save Settings</button>
      </div>
    </div>
  );
}

interface ProductSelectionManagementProps {
  title: string;
  submitText?: string;
}

function ProductSelectionManagement({ title, submitText = "Submit" }: ProductSelectionManagementProps) {
  const { products, categories } = useStore();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Record<string, boolean>>({});

  const filteredProducts = products.filter((product) => {
    const categoryMatched = categoryFilter === "all" || product.category === categoryFilter;
    if (!categoryMatched) return false;

    if (!searchText.trim()) return true;
    const keyword = searchText.toLowerCase();

    return (
      product.name.toLowerCase().includes(keyword) ||
      (product.brand || "").toLowerCase().includes(keyword) ||
      (product.subcategory || "").toLowerCase().includes(keyword)
    );
  });

  const selectedCount = Object.values(selectedProducts).filter(Boolean).length;

  const toggleSelection = (productId: string) => {
    setSelectedProducts((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleSubmit = () => {
    toast.success(`${selectedCount} product updated in ${title.toLowerCase()}`);
  };

  return (
    <div className="space-y-4">
      <SectionHeading title={title} />

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            {submitText}
          </button>

          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search"
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:border-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-230 text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                <th className="pb-3 font-medium">Select</th>
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">Buy Price</th>
                <th className="pb-3 font-medium">Sell Price</th>
                <th className="pb-3 font-medium">Stock</th>
                <th className="pb-3 font-medium">Category</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const categoryName = categories.find((category) => category.id === product.category)?.name || "-";

                return (
                  <tr key={product.id} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-3">
                      <input
                        type="checkbox"
                        checked={Boolean(selectedProducts[product.id])}
                        onChange={() => toggleSelection(product.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-md bg-gray-100">
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">Size: {(product.subcategory || "Default")}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-gray-700">{formatCurrency(product.originalPrice)}</td>
                    <td className="py-3 text-gray-900">{formatCurrency(product.price)}</td>
                    <td className="py-3 text-gray-700">{product.inStock ? "100000" : "0"}</td>
                    <td className="py-3 text-gray-700">{categoryName}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">No products matched your filter.</p>
        )}
      </div>
    </div>
  );
}

interface CategorySelectionManagementProps {
  title: string;
}

function CategorySelectionManagement({ title }: CategorySelectionManagementProps) {
  const { categories } = useStore();
  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Record<string, boolean>>({});

  const filteredCategories = categories.filter((category) => {
    if (!searchText.trim()) return true;
    const keyword = searchText.toLowerCase();

    return (
      category.name.toLowerCase().includes(keyword) ||
      (category.subcategories || []).some((subcategory) => subcategory.toLowerCase().includes(keyword))
    );
  });

  const selectedCount = Object.values(selectedCategories).filter(Boolean).length;

  const toggleSelection = (categoryId: string) => {
    setSelectedCategories((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const handleSubmit = () => {
    toast.success(`${selectedCount} category updated in ${title.toLowerCase()}`);
  };

  return (
    <div className="space-y-4">
      <SectionHeading title={title} />

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            Submit
          </button>

          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search category"
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:border-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                <th className="pb-3 font-medium">Select</th>
                <th className="pb-3 font-medium">Image</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Subcategories</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id} className="border-b border-gray-100 last:border-b-0">
                  <td className="py-3">
                    <input
                      type="checkbox"
                      checked={Boolean(selectedCategories[category.id])}
                      onChange={() => toggleSelection(category.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </td>
                  <td className="py-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-md bg-gray-100">
                      <Image src={category.image} alt={category.name} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="py-3 font-medium text-gray-900">{category.name}</td>
                  <td className="py-3 text-gray-600">{(category.subcategories || []).join(", ") || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCategories.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">No category matched your search.</p>
        )}
      </div>
    </div>
  );
}

function VideoListManagement() {
  const [videos, setVideos] = useState<Array<{ id: string; url: string }>>([
    { id: "1", url: "https://www.youtube.com/watch?v=GCy7Er6LoA" },
    { id: "2", url: "https://www.youtube.com/watch?v=8wYECPqmZw" },
  ]);
  const [newUrl, setNewUrl] = useState("");

  const handleAddVideo = () => {
    const url = newUrl.trim();
    if (!url) {
      toast.error("Please enter a video url");
      return;
    }

    setVideos((prev) => [{ id: Math.random().toString(36).slice(2, 9), url }, ...prev]);
    setNewUrl("");
    toast.success("Video added");
  };

  const handleDeleteVideo = (id: string) => {
    setVideos((prev) => prev.filter((video) => video.id !== id));
    toast.success("Video removed");
  };

  return (
    <div className="space-y-4">
      <SectionHeading title="YouTube Video List" />

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="w-full max-w-xl">
            <input
              value={newUrl}
              onChange={(event) => setNewUrl(event.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition focus:border-primary"
            />
          </div>
          <button
            type="button"
            onClick={handleAddVideo}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            + Add Video
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-155 text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                <th className="pb-3 font-medium">Url</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video.id} className="border-b border-gray-100 last:border-b-0">
                  <td className="py-3 text-gray-700">{video.url}</td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50"
                      >
                        <Edit2 className="h-4 w-4" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDeleteVideo(video.id)}
                        className="rounded-md border border-rose-200 p-2 text-rose-500 transition-colors hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TrashOrdersManagement() {
  return <OrdersManagement title="Trash Order List" initialStatus="cancelled" />;
}

function CustomerListManagement() {
  return <CustomersManagement title="Customer List" />;
}

function BannerListManagement() {
  return <SliderManagement />;
}

function FlashSaleManagement() {
  const { products, updateProduct } = useStore();
  const [searchText, setSearchText] = useState("");

  const flashProducts = products.filter((product) => {
    if (!product.isFlashDeal) return false;
    if (!searchText.trim()) return true;
    const keyword = searchText.toLowerCase();
    return product.name.toLowerCase().includes(keyword);
  });

  const removeFlashDeal = (productId: string) => {
    updateProduct(productId, { isFlashDeal: false, discountPercent: 0 });
    toast.success("Removed from flash sale");
  };

  return (
    <div className="space-y-4">
      <SectionHeading title="Flash Sale" />

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative mb-4 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search product"
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:border-primary"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Original</th>
                <th className="pb-3 font-medium">Discount</th>
                <th className="pb-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {flashProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 last:border-b-0">
                  <td className="py-3 font-medium text-gray-900">{product.name}</td>
                  <td className="py-3 text-gray-700">{formatCurrency(product.price)}</td>
                  <td className="py-3 text-gray-700">{formatCurrency(product.originalPrice)}</td>
                  <td className="py-3 text-gray-700">{product.discountPercent}%</td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => removeFlashDeal(product.id)}
                        className="rounded-md border border-rose-200 p-2 text-rose-500 transition-colors hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {flashProducts.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">No product in flash sale.</p>
        )}
      </div>
    </div>
  );
}

function FreeDeliveryManagement() {
  return <ProductSelectionManagement title="Free Delivery" />;
}

function FreeCategoryDeliveryManagement() {
  return <CategorySelectionManagement title="Free Category Delivery" />;
}

function TagCategoryManagement() {
  return <CategorySelectionManagement title="Tag Category" />;
}

function EntryPromotionManagement() {
  return <ProductSelectionManagement title="Entry Promotion" />;
}

function EntryProductsManagement() {
  return <ProductSelectionManagement title="Entry Products" />;
}

// Main Admin Dashboard with Tabs
export function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { products, orders, categories, promoCodes } = useStore();
  const pathSegment = location.pathname.split("/")[2] || "";
  const pathTabMap: Record<string, string> = {
    orders: "orders",
    customers: "customers",
    analytics: "analytics",
    reports: "reports",
  };
  const activeTab = searchParams.get("tab") || pathTabMap[pathSegment] || "dashboard";

  const customerCount = new Set(orders.map((order) => order.customerPhone)).size;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter((order) => order.status === "pending").length;
  const deliveredOrders = orders.filter((order) => order.status === "delivered").length;
  const cancelledOrders = orders.filter((order) => order.status === "cancelled").length;

  const statusChartData = [
    { name: "Pending", value: pendingOrders, color: "#f59e0b" },
    { name: "Delivered", value: deliveredOrders, color: "#10b981" },
    { name: "Cancelled", value: cancelledOrders, color: "#f43f5e" },
  ].filter((item) => item.value > 0);

  const categoryChartData = categories
    .map((category) => ({
      name: category.name,
      value: products.filter((product) => product.category === category.id).length,
    }))
    .filter((category) => category.value > 0)
    .slice(0, 6);

  const trendData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));

    const label = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
    const key = date.toISOString().slice(0, 10);

    const revenue = orders
      .filter((order) => new Date(order.createdAt).toISOString().slice(0, 10) === key)
      .reduce((sum, order) => sum + order.total, 0);

    return {
      day: label,
      revenue: Number(revenue.toFixed(2)),
    };
  });

  const topOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const sectionLabelMap: Record<string, string> = {
    dashboard: "Overview",
    sliders: "Banner Slides",
    "banner-list": "Banner List",
    categories: "Categories List",
    "tag-category": "Tag Category",
    products: "Product List",
    "entry-products": "Entry Products",
    "entry-promotion": "Entry Promotion",
    "flash-deals": "Flash Deals",
    "flash-sale": "Flash Sale",
    promo: "Promo Codes",
    orders: "Orders",
    "trash-orders": "Trash Order List",
    customers: "Customers",
    "customer-list": "Customer List",
    "free-delivery": "Free Delivery",
    "free-category-delivery": "Free Category Delivery",
    "video-list": "YouTube Video List",
    analytics: "Analytics",
    reports: "Reports",
    settings: "Settings",
  };

  const activeSectionLabel = sectionLabelMap[activeTab] || "Overview";

  const renderContent = () => {
    switch (activeTab) {
      case "sliders": return <SliderManagement />;
      case "banner-list": return <BannerListManagement />;
      case "categories": return <CategoryManagement />;
      case "tag-category": return <TagCategoryManagement />;
      case "products": return <ProductManagement />;
      case "entry-products": return <EntryProductsManagement />;
      case "entry-promotion": return <EntryPromotionManagement />;
      case "flash-deals": return <FlashDealManagement />;
      case "flash-sale": return <FlashSaleManagement />;
      case "promo": return <PromoCodeManagement />;
      case "orders": return <OrdersManagement />;
      case "trash-orders": return <TrashOrdersManagement />;
      case "customers": return <CustomersManagement />;
      case "customer-list": return <CustomerListManagement />;
      case "free-delivery": return <FreeDeliveryManagement />;
      case "free-category-delivery": return <FreeCategoryDeliveryManagement />;
      case "video-list": return <VideoListManagement />;
      case "analytics": return <AnalyticsManagement />;
      case "reports": return <ReportsManagement />;
      case "settings": return <SettingsManagement />;
      default:
        return (
          <div className="space-y-4">
            <SectionHeading
              title="Business Overview"
              subtitle="Quick performance snapshot across your core admin operations"
            />

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard title="Total Products" value={products.length} icon={Package} iconClassName="text-indigo-600" />
              <MetricCard title="Total Orders" value={orders.length} icon={ShoppingCart} iconClassName="text-blue-600" />
              <MetricCard title="Customers" value={customerCount} icon={Users} iconClassName="text-cyan-600" />
              <MetricCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={DollarSign} iconClassName="text-emerald-600" />
              <MetricCard title="Pending Orders" value={pendingOrders} icon={Clock3} iconClassName="text-amber-600" valueClassName="text-amber-600" />
              <MetricCard title="Delivered Orders" value={deliveredOrders} icon={CheckCircle2} iconClassName="text-emerald-600" valueClassName="text-emerald-600" />
              <MetricCard title="Cancelled Orders" value={cancelledOrders} icon={Ban} iconClassName="text-rose-600" valueClassName="text-rose-600" />
              <MetricCard title="Promo Codes" value={promoCodes.length} icon={BarChart3} iconClassName="text-purple-600" />
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">Order Status</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={84}
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {statusChartData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">Category Product Count</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                      <YAxis allowDecimals={false} stroke="#6b7280" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
              <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">Revenue Trend (7 days)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2.5} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">Recent Orders</h3>
                {topOrders.length === 0 ? (
                  <p className="py-10 text-center text-sm text-gray-500">No recent order found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-105 text-left text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                          <th className="pb-3 font-medium">ID</th>
                          <th className="pb-3 font-medium">Customer</th>
                          <th className="pb-3 font-medium">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topOrders.map((order) => (
                          <tr key={order.id} className="border-b border-gray-100 last:border-b-0">
                            <td className="py-3 font-medium text-gray-900">{order.id}</td>
                            <td className="py-3 text-gray-700">{order.customerName}</td>
                            <td className="py-3 font-medium text-gray-900">{formatCurrency(order.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-gray-50">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex w-full max-w-350 items-center justify-between px-4 py-3 md:px-6">
              <div className="flex items-center gap-3">
                <button onClick={() => setSidebarOpen(true)} className="rounded-md p-2 hover:bg-gray-100 lg:hidden">
                  <Menu className="h-5 w-5 text-gray-700" />
                </button>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Admin panel</p>
                  <h1 className="text-base font-semibold text-gray-900 md:text-lg">{activeSectionLabel}</h1>
                </div>
              </div>

              <Link
                to="/admin"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-50"
              >
                Logout
              </Link>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 md:p-6">
            <div className="mx-auto w-full max-w-350">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
