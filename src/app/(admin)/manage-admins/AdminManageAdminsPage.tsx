import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Menu, Pencil, RefreshCcw, Trash2, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";

import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

type AdminRecord = {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse<T> = {
  message?: string;
  status?: boolean;
  statusCode?: number;
  data?: T | null;
};

type AdminForm = {
  email: string;
  password: string;
  isActive: boolean;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";
const ADMINS_ENDPOINT = "/admins";

const defaultCreateForm: AdminForm = {
  email: "",
  password: "",
  isActive: true,
};

const getErrorMessage = async (response: Response, fallback: string): Promise<string> => {
  try {
    const payload = (await response.json()) as ApiResponse<unknown>;
    return payload?.message || fallback;
  } catch {
    return fallback;
  }
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
};

export function AdminManageAdminsPage() {
  const navigate = useNavigate();
  const { accessToken, logout } = useAdminAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [createForm, setCreateForm] = useState<AdminForm>(defaultCreateForm);
  const [editTarget, setEditTarget] = useState<AdminRecord | null>(null);
  const [editForm, setEditForm] = useState<AdminForm>(defaultCreateForm);

  const isApiReady = useMemo(() => API_BASE_URL.length > 0, []);

  const getHeaders = useCallback(
    (includeJsonContentType = false) => {
      const headers: HeadersInit = {
        Authorization: `Bearer ${accessToken}`,
      };

      if (includeJsonContentType) {
        headers["Content-Type"] = "application/json";
      }

      return headers;
    },
    [accessToken],
  );

  const fetchAdmins = useCallback(async () => {
    if (!isApiReady || !accessToken) {
      return;
    }

    setIsFetching(true);

    try {
      const response = await fetch(`${API_BASE_URL}${ADMINS_ENDPOINT}`, {
        method: "GET",
        headers: getHeaders(false),
      });

      const payload = (await response.json()) as ApiResponse<AdminRecord[]>;

      if (!response.ok || !payload?.status) {
        throw new Error(payload?.message || "Failed to load admins.");
      }

      setAdmins(Array.isArray(payload.data) ? payload.data : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load admins.";
      toast.error(message);
    } finally {
      setIsFetching(false);
    }
  }, [accessToken, getHeaders, isApiReady]);

  useEffect(() => {
    void fetchAdmins();
  }, [fetchAdmins]);

  const handleCreateAdmin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!accessToken) {
      toast.error("Admin token not found. Please login again.");
      return;
    }

    const email = createForm.email.trim();
    const password = createForm.password.trim();

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch(`${API_BASE_URL}${ADMINS_ENDPOINT}`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify({
          email,
          password,
          isActive: createForm.isActive,
        }),
      });

      if (!response.ok) {
        const message = await getErrorMessage(response, "Failed to create admin.");
        throw new Error(message);
      }

      const payload = (await response.json()) as ApiResponse<AdminRecord>;

      if (!payload?.status || !payload.data) {
        throw new Error(payload?.message || "Failed to create admin.");
      }

      toast.success(payload.message || "Admin created successfully.");
      setCreateForm(defaultCreateForm);
      setAdmins((prev) => [payload.data as AdminRecord, ...prev]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create admin.";
      toast.error(message);
    } finally {
      setIsCreating(false);
    }
  };

  const beginEdit = (admin: AdminRecord) => {
    setEditTarget(admin);
    setEditForm({
      email: admin.email,
      password: "",
      isActive: admin.isActive,
    });
  };

  const handleUpdateAdmin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editTarget) {
      toast.error("Select an admin first.");
      return;
    }

    const email = editForm.email.trim();
    const password = editForm.password.trim();

    if (!email) {
      toast.error("Email is required.");
      return;
    }

    setIsUpdating(true);

    try {
      const body: { email: string; isActive: boolean; password?: string } = {
        email,
        isActive: editForm.isActive,
      };

      if (password.length > 0) {
        body.password = password;
      }

      const response = await fetch(`${API_BASE_URL}${ADMINS_ENDPOINT}/${editTarget.id}`, {
        method: "PUT",
        headers: getHeaders(true),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const message = await getErrorMessage(response, "Failed to update admin.");
        throw new Error(message);
      }

      const payload = (await response.json()) as ApiResponse<AdminRecord>;
      if (!payload?.status || !payload.data) {
        throw new Error(payload?.message || "Failed to update admin.");
      }

      toast.success(payload.message || "Admin updated successfully.");
      const updatedAdmin = payload.data as AdminRecord;
      setAdmins((prev) => prev.map((admin) => (admin.id === updatedAdmin.id ? updatedAdmin : admin)));
      setEditTarget(updatedAdmin);
      setEditForm((prev) => ({ ...prev, password: "" }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update admin.";
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAdmin = async (admin: AdminRecord) => {
    const shouldDelete = window.confirm(`Delete admin ${admin.email}?`);
    if (!shouldDelete) {
      return;
    }

    setDeletingId(admin.id);

    try {
      const response = await fetch(`${API_BASE_URL}${ADMINS_ENDPOINT}/${admin.id}`, {
        method: "DELETE",
        headers: getHeaders(false),
      });

      if (!response.ok) {
        const message = await getErrorMessage(response, "Failed to delete admin.");
        throw new Error(message);
      }

      const payload = (await response.json()) as ApiResponse<null>;

      if (!payload?.status) {
        throw new Error(payload?.message || "Failed to delete admin.");
      }

      toast.success(payload.message || "Admin deleted successfully.");
      setAdmins((prev) => prev.filter((item) => item.id !== admin.id));

      if (editTarget?.id === admin.id) {
        setEditTarget(null);
        setEditForm(defaultCreateForm);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete admin.";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin", { replace: true });
  };

  if (!isApiReady) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-2xl rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900">
          <p className="font-semibold">Missing API base URL</p>
          <p className="mt-1 text-sm">Set NEXT_PUBLIC_API_BASE_URL in your frontend env file.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={handleLogout} />

      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto w-full max-w-7xl space-y-6">
          <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Admin Management</p>
                  <h1 className="mt-1 text-2xl font-bold text-slate-900">Manage Admins</h1>
                  <p className="mt-1 text-sm text-slate-600">Create, list, update and delete admin accounts.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => void fetchAdmins()}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </header>

          <section className="grid gap-4 xl:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-slate-900">
                <UserPlus className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Create Admin</h2>
              </div>

              <form className="space-y-3" onSubmit={handleCreateAdmin}>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    value={createForm.email}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                    placeholder="admin@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                  <input
                    type="password"
                    value={createForm.password}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, password: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                    placeholder="Enter strong password"
                    required
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={createForm.isActive}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, isActive: event.target.checked }))}
                  />
                  Is Active
                </label>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                  {isCreating ? "Creating..." : "Create Admin"}
                </button>
              </form>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-slate-900">
                <Pencil className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Update Admin</h2>
              </div>

              {!editTarget ? (
                <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-6 text-center text-sm text-slate-500">
                  Select an admin from the list to edit.
                </p>
              ) : (
                <form className="space-y-3" onSubmit={handleUpdateAdmin}>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, email: event.target.value }))}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Password (optional)</label>
                    <input
                      type="password"
                      value={editForm.password}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, password: event.target.value }))}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                      placeholder="Leave empty to keep current password"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={editForm.isActive}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, isActive: event.target.checked }))}
                    />
                    Is Active
                  </label>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
                      {isUpdating ? "Updating..." : "Update Admin"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditTarget(null);
                        setEditForm(defaultCreateForm);
                      }}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </article>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-slate-900">
                <Users className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Admins List</h2>
              </div>
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {admins.length} total
              </span>
            </div>

            {isFetching ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading admins...
              </div>
            ) : admins.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-8 text-center text-sm text-slate-500">
                No admins found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-3 py-3">Email</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Created</th>
                      <th className="px-3 py-3">Updated</th>
                      <th className="px-3 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => {
                      const isDeleting = deletingId === admin.id;

                      return (
                        <tr key={admin.id} className="border-b border-slate-100">
                          <td className="px-3 py-3 font-medium text-slate-900">{admin.email}</td>
                          <td className="px-3 py-3">
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                admin.isActive
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-rose-100 text-rose-700"
                              }`}
                            >
                              {admin.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-slate-600">{formatDate(admin.createdAt)}</td>
                          <td className="px-3 py-3 text-slate-600">{formatDate(admin.updatedAt)}</td>
                          <td className="px-3 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => beginEdit(admin)}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => void handleDeleteAdmin(admin)}
                                disabled={isDeleting}
                                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
