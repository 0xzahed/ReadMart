import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";

import { StoreLayout } from "@/app/layouts/StoreLayout";
import { AdminLayout } from "@/features/admin/components/AdminLayout";
import { RequireAdmin } from "@/features/admin/components/RequireAdmin";
import { AdminDashboardPage } from "@/features/admin/pages/AdminDashboardPage";
import { AdminLoginPage } from "@/features/admin/pages/AdminLoginPage";
import { AdminOrdersPage } from "@/features/admin/pages/AdminOrdersPage";
import { AdminProductsPage } from "@/features/admin/pages/AdminProductsPage";
import { CartPage } from "@/features/store/pages/CartPage";
import { ExplorePage } from "@/features/store/pages/ExplorePage";
import { HomePage } from "@/features/store/pages/HomePage";
import { ProductDetailPage } from "@/features/store/pages/ProductDetailPage";
import { WishlistPage } from "@/features/store/pages/WishlistPage";
import { NotFoundPage } from "@/shared/pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <StoreLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "explore", element: <ExplorePage /> },
      { path: "product/:id", element: <ProductDetailPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "wishlist", element: <WishlistPage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin/dashboard",
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
    ],
  },
  {
    path: "/admin/products",
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [{ index: true, element: <AdminProductsPage /> }],
  },
  {
    path: "/admin/orders",
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [{ index: true, element: <AdminOrdersPage /> }],
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