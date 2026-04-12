import { Navigate, RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";

import { StoreLayout } from "@/app/layouts/StoreLayout";
import { AdminDashboardPage } from "@/features/admin/pages/AdminDashboardPage";
import { AdminLoginPage } from "@/features/admin/pages/AdminLoginPage";
import { CartPage } from "@/features/store/pages/CartPage";
import { ExplorePage } from "@/features/store/pages/ExplorePage";
import { HomePage } from "@/features/store/pages/HomePage";
import { ProductDetailPage } from "@/features/store/pages/ProductDetailPage";
import { WishlistPage } from "@/features/store/pages/WishlistPage";
import { SearchPage } from "@/features/store/pages/SearchPage";
import { OrderConfirmationPage } from "@/features/store/pages/OrderConfirmationPage";
import { OrdersPage } from "@/features/store/pages/OrdersPage";
import { ScanPage } from "@/features/store/pages/ScanPage";
import { ChatPage } from "@/features/store/pages/ChatPage";
import { OffersPage } from "@/features/store/pages/OffersPage";
import { MorePage } from "@/features/store/pages/MorePage";
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