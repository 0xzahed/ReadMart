import { Outlet } from "react-router-dom";

import BottomNav from "@/shared/components/layout/BottomNav";
import DesktopHeader from "@/shared/components/layout/DesktopHeader";
import MobileHeader from "@/shared/components/layout/MobileHeader";
import SiteFooter from "@/shared/components/layout/SiteFooter";

export function StoreLayout() {
  return (
    <>
      <DesktopHeader />
      <MobileHeader />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
      <BottomNav />
    </>
  );
}