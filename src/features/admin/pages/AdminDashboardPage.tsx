"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Menu,
} from "lucide-react";
import { useStore, Slider, Category, Product, PromoCode } from "@/contexts/StoreContext";
import { toast } from "sonner";
import { AdminSidebar } from "../components/AdminSidebar";

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Sliders</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Slider
        </button>
      </div>
      <div className="space-y-3">
        {sliders.map((slider) => (
          <div key={slider.id} className="bg-card rounded-lg p-4 flex items-center gap-4">
            <div className="relative w-24 h-14 bg-secondary rounded overflow-hidden flex-shrink-0">
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
              <input type="text" placeholder="Image URL" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full px-3 py-2 bg-secondary rounded-lg" required />
              <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 bg-secondary rounded-lg" required />
              <input type="text" placeholder="Subtitle" value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="w-full px-3 py-2 bg-secondary rounded-lg" />
              <input type="text" placeholder="Button Link" value={formData.buttonLink} onChange={(e) => setFormData({...formData, buttonLink: e.target.value})} className="w-full px-3 py-2 bg-secondary rounded-lg" required />
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
  const [formData, setFormData] = useState({ name: "", image: "", link: "", isActive: true });

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, image: category.image, link: category.link || "", isActive: category.isActive });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", image: "", link: "", isActive: true });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.image) {
      toast.error("Please fill in required fields");
      return;
    }
    if (editingCategory) {
      updateCategory(editingCategory.id, formData);
      toast.success("Category updated");
    } else {
      addCategory(formData);
      toast.success("Category added");
    }
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Categories</h2>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm">
          <Plus className="w-4 h-4" />Add Category
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-card rounded-lg p-3 text-center">
            <div className="relative w-full aspect-square bg-secondary rounded-lg overflow-hidden mb-2">
              <Image src={cat.image} alt={cat.name} fill className="object-cover p-2" />
            </div>
            <h3 className="font-medium text-sm truncate">{cat.name}</h3>
            <div className="flex gap-2 mt-2 justify-center">
              <button onClick={() => handleOpenModal(cat)} className="p-1 hover:bg-secondary rounded"><Edit2 className="w-3 h-3" /></button>
              <button onClick={() => deleteCategory(cat.id)} className="p-1 hover:bg-secondary rounded text-destructive"><Trash2 className="w-3 h-3" /></button>
            </div>
          </div>
        ))}
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
              <input type="text" placeholder="Image URL" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full px-3 py-2 bg-secondary rounded-lg" required />
              <input type="text" placeholder="Link (optional)" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} className="w-full px-3 py-2 bg-secondary rounded-lg" />
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
  const [formData, setFormData] = useState({
    name: "", price: 0, originalPrice: 0, images: [""], category: "",
    brand: "", rating: 0, reviews: 0, description: "", colors: [""],
    barcode: "", inStock: true, isFlashDeal: false, discountPercent: 0,
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name, price: product.price, originalPrice: product.originalPrice,
        images: product.images, category: product.category, brand: product.brand || "",
        rating: product.rating, reviews: product.reviews, description: product.description,
        colors: product.colors, barcode: product.barcode || "", inStock: product.inStock,
        isFlashDeal: product.isFlashDeal, discountPercent: product.discountPercent,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "", price: 0, originalPrice: 0, images: [""], category: categories[0]?.id || "",
        brand: "", rating: 0, reviews: 0, description: "", colors: [""],
        barcode: "", inStock: true, isFlashDeal: false, discountPercent: 0,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      toast.error("Please fill in required fields");
      return;
    }
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
      toast.success("Product updated");
    } else {
      addProduct(formData);
      toast.success("Product added");
    }
    setShowModal(false);
  };

  const addColor = () => setFormData({...formData, colors: [...formData.colors, ""]});
  const removeColor = (index: number) => setFormData({...formData, colors: formData.colors.filter((_, i) => i !== index)});
  const updateColor = (index: number, value: string) => {
    const newColors = [...formData.colors];
    newColors[index] = value;
    setFormData({...formData, colors: newColors});
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Products</h2>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm">
          <Plus className="w-4 h-4" />Add Product
        </button>
      </div>
      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.id} className="bg-card rounded-lg p-4 flex items-center gap-4">
            <div className="relative w-16 h-16 bg-secondary rounded overflow-hidden flex-shrink-0">
              <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{product.name}</h3>
              <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleOpenModal(product)} className="p-2 hover:bg-secondary rounded"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => deleteProduct(product.id)} className="p-2 hover:bg-secondary rounded text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
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
              <div className="grid grid-cols-2 gap-3">
                <input type="number" step="0.01" placeholder="Price" value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full px-3 py-2 bg-secondary rounded-lg" required />
                <input type="number" step="0.01" placeholder="Original Price" value={formData.originalPrice} onChange={(e) => setFormData({...formData, originalPrice: parseFloat(e.target.value)})} className="w-full px-3 py-2 bg-secondary rounded-lg" />
              </div>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 bg-secondary rounded-lg" required>
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input type="text" placeholder="Brand (optional)" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} className="w-full px-3 py-2 bg-secondary rounded-lg" />
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
              <input type="number" placeholder="Discount %" value={formData.discountPercent} onChange={(e) => setFormData({...formData, discountPercent: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-secondary rounded-lg" />

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Promo Codes</h2>
        <button onClick={() => { setEditingPromo(null); setFormData({ code: "", discountPercent: 0, isActive: true, expiryDate: "" }); setShowModal(true); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm">
          <Plus className="w-4 h-4" />Add Code
        </button>
      </div>
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
              <input type="number" placeholder="Discount %" value={formData.discountPercent} onChange={(e) => setFormData({...formData, discountPercent: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-secondary rounded-lg" required />
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
      <h2 className="text-xl font-bold mb-6">Settings</h2>
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

// Main Admin Dashboard with Tabs
export function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Read tab from URL
  useEffect(() => {
    const tab = searchParams[0].get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "sliders", label: "Sliders", icon: LayoutDashboard },
    { id: "categories", label: "Categories", icon: Package },
    { id: "products", label: "Products", icon: Package },
    { id: "promo", label: "Promo Codes", icon: ShoppingCart },
    { id: "settings", label: "Settings", icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "sliders": return <SliderManagement />;
      case "categories": return <CategoryManagement />;
      case "products": return <ProductManagement />;
      case "promo": return <PromoCodeManagement />;
      case "settings": return <SettingsManagement />;
      default:
        return (
          <div>
            <h2 className="text-xl font-bold mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Products</p>
                    <p className="text-3xl font-bold text-gray-900">{useStore().products.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-red-500" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Orders</p>
                    <p className="text-3xl font-bold text-gray-900">{useStore().orders.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Customers</p>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">${useStore().orders.reduce((sum, o) => sum + o.total, 0).toFixed(0)}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-full">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-gray-900">Admin Panel</h1>
            <div className="w-9" />
          </div>
        </div>

        {/* Tab Navigation - Desktop sidebar, mobile tabs */}
        <div className="bg-white border-b border-gray-200 lg:hidden overflow-x-auto">
          <div className="flex px-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-3 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-red-500 text-red-500"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
