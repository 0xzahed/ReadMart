import sneaker1 from "@/assets/products/sneaker1.png";
import handbag1 from "@/assets/products/handbag1.png";
import headphones1 from "@/assets/products/headphones1.png";
import watch1 from "@/assets/products/watch1.png";
import dress1 from "@/assets/products/dress1.png";
import sofa1 from "@/assets/products/sofa1.png";
import type { LucideIcon } from "lucide-react";
import { Footprints, Headphones, Shirt, ShoppingBag, Sofa, Watch } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  colors?: string[];
  sizes?: string[];
  inStock: boolean;
  badge?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  count: number;
}

export const categories: Category[] = [
  { id: "shoes", name: "Shoes", icon: Footprints, count: 234 },
  { id: "bags", name: "Bags", icon: ShoppingBag, count: 156 },
  { id: "electronics", name: "Electronics", icon: Headphones, count: 89 },
  { id: "watches", name: "Watches", icon: Watch, count: 120 },
  { id: "clothing", name: "Clothing", icon: Shirt, count: 345 },
  { id: "furniture", name: "Furniture", icon: Sofa, count: 67 },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Air Max Sneakers",
    price: 129.99,
    originalPrice: 179.99,
    image: sneaker1.src,
    category: "shoes",
    rating: 4.5,
    reviews: 1289,
    description: "Premium lightweight sneakers with Air Max cushioning technology. Perfect for everyday comfort and style.",
    colors: ["#FFFFFF", "#000000", "#FF4747"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    inStock: true,
    badge: "Sale",
  },
  {
    id: "2",
    name: "Luxury Red Handbag",
    price: 249.99,
    image: handbag1.src,
    category: "bags",
    rating: 4.8,
    reviews: 856,
    description: "Elegant red leather handbag with gold-tone hardware. Spacious interior with multiple compartments.",
    colors: ["#FF4747", "#000000", "#8B4513"],
    inStock: true,
    badge: "New",
  },
  {
    id: "3",
    name: "Studio Pro Headphones",
    price: 199.99,
    originalPrice: 299.99,
    image: headphones1.src,
    category: "electronics",
    rating: 4.7,
    reviews: 2341,
    description: "Premium over-ear headphones with active noise cancellation and 40-hour battery life.",
    colors: ["#242424", "#FFFFFF"],
    inStock: true,
    badge: "Best Seller",
  },
  {
    id: "4",
    name: "Classic Gold Watch",
    price: 459.99,
    image: watch1.src,
    category: "watches",
    rating: 4.9,
    reviews: 567,
    description: "Elegant gold-tone chronograph watch with genuine leather strap. Water resistant to 50m.",
    colors: ["#DAA520", "#C0C0C0"],
    inStock: true,
  },
  {
    id: "5",
    name: "Red Summer Dress",
    price: 89.99,
    originalPrice: 129.99,
    image: dress1.src,
    category: "clothing",
    rating: 4.3,
    reviews: 423,
    description: "Vibrant red casual dress perfect for summer occasions. Lightweight and comfortable fabric.",
    colors: ["#FF4747", "#000000", "#FFFFFF"],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true,
    badge: "Sale",
  },
  {
    id: "6",
    name: "Modern Sofa Chair",
    price: 899.99,
    originalPrice: 1199.99,
    image: sofa1.src,
    category: "furniture",
    rating: 4.6,
    reviews: 189,
    description: "Comfortable modern sofa with premium fabric upholstery. Seats up to 3 people comfortably.",
    colors: ["#D2B48C", "#808080", "#2F4F4F"],
    inStock: true,
  },
];
