"use client";

import { Bell } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import { StoreCard, StorePageHeader, StoreButton } from "@/components/ui/store";

export function NotificationsPage() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, unreadNotificationCount } = useStore();

  return (
    <div className="min-h-screen bg-background pb-24">
      <StorePageHeader title="Notifications" backTo="/" />

      <div className="mx-auto w-full max-w-330 space-y-4 px-4 pt-4 sm:px-6 lg:px-8">
        {unreadNotificationCount > 0 ? (
          <StoreButton tone="secondary" onClick={markAllNotificationsAsRead} fullWidth>
            Mark All as Read
          </StoreButton>
        ) : null}

        {notifications.length === 0 ? (
          <StoreCard className="py-10 text-center">
            <Bell className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </StoreCard>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => markNotificationAsRead(notification.id)}
              className={`w-full rounded-xl border p-4 text-left transition-colors ${
                notification.isRead
                  ? "border-border bg-card"
                  : "border-primary/25 bg-primary/5"
              }`}
            >
              <p className="text-sm font-semibold text-foreground">{notification.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{notification.message}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
