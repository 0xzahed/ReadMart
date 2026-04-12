"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { useStore, Slider } from "@/contexts/StoreContext";
import { toast } from "sonner";

export function AdminSliderManagement() {
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

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this slider?")) {
      deleteSlider(id);
      toast.success("Slider deleted successfully");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Slider Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Slider
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sliders.map((slider) => (
          <div key={slider.id} className="bg-card rounded-xl overflow-hidden shadow-sm">
            <div className="relative aspect-video bg-secondary">
              <Image
                src={slider.image}
                alt={slider.title}
                fill
                className="object-cover"
              />
              {!slider.isActive && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold">Inactive</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-1">{slider.title}</h3>
              {slider.subtitle && (
                <p className="text-sm text-muted-foreground mb-2">{slider.subtitle}</p>
              )}
              <p className="text-xs text-muted-foreground mb-3">
                Link: {slider.buttonLink}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(slider)}
                  className="flex-1 flex items-center justify-center gap-2 bg-secondary text-foreground px-3 py-2 rounded-lg hover:bg-secondary/80 transition-colors text-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(slider.id)}
                  className="flex items-center justify-center bg-destructive/10 text-destructive px-3 py-2 rounded-lg hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sliders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No sliders added yet</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingSlider ? "Edit Slider" : "Add Slider"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Image URL <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2.5 bg-secondary rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="/path/to/image.jpg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 1920x1080px (16:9 ratio)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-secondary rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="iPhone 16 Pro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-secondary rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Extraordinary Visual & Exceptional Power"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Button Text</label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  className="w-full px-4 py-2.5 bg-secondary rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Button Link <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  className="w-full px-4 py-2.5 bg-secondary rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="/product/1 or /category/mobile"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Active
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-secondary rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  {editingSlider ? "Update" : "Add"} Slider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
