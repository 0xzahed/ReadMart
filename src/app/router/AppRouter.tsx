import { Navigate, RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";

import { StoreLayout } from "@/app/layouts/StoreLayout";
import { AdminDashboardPage } from "@/features/admin/modules/dashboard/AdminDashboardPage";
import { AdminLoginPage } from "@/features/admin/modules/auth/AdminLoginPage";
import { CartPage } from "@/features/store/modules/cart/CartPage";
import { ExplorePage } from "@/features/store/modules/catalog/ExplorePage";
import { HomePage } from "@/features/store/modules/home/HomePage";
import { ProductDetailPage } from "@/features/store/modules/catalog/ProductDetailPage";
import { WishlistPage } from "@/features/store/modules/wishlist/WishlistPage";
import { SearchPage } from "@/features/store/modules/catalog/SearchPage";
import { CategoriesPage } from "@/features/store/modules/catalog/CategoriesPage";
import { CategoryProductsPage } from "@/features/store/modules/catalog/CategoryProductsPage";
import { OrderConfirmationPage } from "@/features/store/modules/orders/OrderConfirmationPage";
import { OrdersPage } from "@/features/store/modules/orders/OrdersPage";
import { ScanPage } from "@/features/store/modules/scan/ScanPage";
import { ChatPage } from "@/features/store/modules/chat/ChatPage";
import { OffersPage } from "@/features/store/modules/offers/OffersPage";
import { MorePage } from "@/features/store/modules/more/MorePage";
import { NotFoundPage } from "@/shared/pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <StoreLayout><Outlet /></StoreLayout>,
    children: [
      { index: true, element: <HomePage /> },
      { path: "explore", element: <ExplorePage /> },
      { path: "product/:id", element: <ProductDetailPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "wishlist", element: <WishlistPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "categories/:id", element: <CategoryProductsPage /> },
      { path: "order-confirmation", element: <OrderConfirmationPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "scan", element: <ScanPage /> },
      { path: "chat", element: <ChatPage /> },
      { path: "offers", element: <OffersPage /> },
      { path: "more", element: <MorePage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin/*",
    element: <AdminDashboardPage />,
  },
  {
    path: "/auth/signin",
    element: <Navigate to="/admin" replace />,
  },
  {
    path: "/signin",
    element: <Navigate to="/admin" replace />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}