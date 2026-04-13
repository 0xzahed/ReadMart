import { Navigate, RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";

import { StoreLayout } from "@/app/layouts/StoreLayout";
import { AdminDashboardPage } from "@/app/(admin)/dashboard/AdminDashboardPage";
import { AdminLoginPage } from "@/app/(admin)/login/AdminLoginPage";
import { CartPage } from "@/app/(store)/cart/CartPage";
import { ExplorePage } from "@/app/(store)/explore/ExplorePage";
import { HomePage } from "@/app/(store)/home/HomePage";
import { ProductDetailPage } from "@/app/(store)/product-detail/ProductDetailPage";
import { SearchPage } from "@/app/(store)/search/SearchPage";
import { CategoriesPage } from "@/app/(store)/categories/CategoriesPage";
import { CategoryProductsPage } from "@/app/(store)/category-products/CategoryProductsPage";
import { TrendingProductsPage } from "@/app/(store)/trending-products/TrendingProductsPage";
import { NewProductsPage } from "@/app/(store)/new-products/NewProductsPage";
import { OrderConfirmationPage } from "@/app/(store)/order-confirmation/OrderConfirmationPage";
import { OrdersPage } from "@/app/(store)/orders/OrdersPage";
import { ScanPage } from "@/app/(store)/scan/ScanPage";
import { ChatPage } from "@/app/(store)/chat/ChatPage";
import { OffersPage } from "@/app/(store)/offers/OffersPage";
import { MorePage } from "@/app/(store)/more/MorePage";
import { FlashDealsPage } from "@/app/(store)/flash-deals/FlashDealsPage";
import { FreeDeliveryPage } from "@/app/(store)/free-delivery/FreeDeliveryPage";
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
      { path: "trending-products", element: <TrendingProductsPage /> },
      { path: "new-products", element: <NewProductsPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "categories/:id", element: <CategoryProductsPage /> },
      { path: "order-confirmation", element: <OrderConfirmationPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "scan", element: <ScanPage /> },
      { path: "chat", element: <ChatPage /> },
      { path: "offers", element: <OffersPage /> },
      { path: "flash-deals", element: <FlashDealsPage /> },
      { path: "free-delivery", element: <FreeDeliveryPage /> },
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