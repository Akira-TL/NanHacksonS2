import { useState } from "react";
import {
  Users as UsersIcon,
  Shield,
  Mail,
  MoreHorizontal,
  UserPlus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAppContext } from "../contexts/AppContext";

const initialUsers = [
  {
    id: "usr_01",
    name: "Alice Walker",
    email: "alice.w@silicon-melt.com",
    role: "Admin",
    status: "Active",
    lastActive: "2 mins ago",
  },
  {
    id: "usr_02",
    name: "Bob Chen",
    email: "b.chen@silicon-melt.com",
    role: "Operator",
    status: "Active",
    lastActive: "1 hr ago",
  },
  {
    id: "usr_03",
    name: "Charlie Davis",
    email: "cdavis@silicon-melt.com",
    role: "Viewer",
    status: "Offline",
    lastActive: "2 days ago",
  },
  {
    id: "usr_04",
    name: "Diana Prince",
    email: "diana.p@silicon-melt.com",
    role: "Engineer",
    status: "Active",
    lastActive: "Just now",
  },
];

export function UsersManagement() {
  const { t } = useAppContext();
  const [users, setUsers] = useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Operator",
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    setUsers([
      {
        id: `usr_${Math.random().toString(36).substr(2, 5)}`,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: "Active",
        lastActive: "Just now",
      },
      ...users,
    ]);

    setIsModalOpen(false);
    setNewUser({ name: "", email: "", role: "Operator" });
    toast.success("User added successfully");
  };

  const handleAction = (userId: string, action: string) => {
    toast(`Action: ${action}`, { description: `Applied to user ${userId}` });
  };

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 mx-auto w-full max-w-[1440px]">
      <div className="flex justify-between items-center bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border-subtle)] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {t("User Management")}
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {t("Manage platform access, roles, and security policies.")}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <UserPlus className="w-4 h-4" /> {t("Add User")}
        </button>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-base)]">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-[var(--text-muted)]" />
            <h3 className="font-semibold text-[var(--text-primary)]">
              {t("Active Personnel")}
            </h3>
          </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] bg-[var(--bg-card)]">
              <th className="px-6 py-3 font-semibold w-1/3">{t("User")}</th>
              <th className="px-6 py-3 font-semibold">{t("Role")}</th>
              <th className="px-6 py-3 font-semibold">{t("Status")}</th>
              <th className="px-6 py-3 font-semibold">{t("Last Active")}</th>
              <th className="px-6 py-3 font-semibold text-right">
                {t("Actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-[var(--bg-base)] transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] font-bold flex items-center justify-center uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-[var(--text-primary)]">
                        {user.name}
                      </div>
                      <div className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" /> {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 align-middle">
                    <Shield className="w-4 h-4 text-[var(--text-muted)]" />
                    <span className="font-medium text-[var(--text-secondary)]">
                      {user.role}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${user.status === "Active" ? "bg-emerald-400/20 text-emerald-400" : "bg-[var(--bg-base)] text-[var(--text-muted)]"}`}
                  >
                    {t(user.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-[var(--text-muted)] font-medium">
                  {user.lastActive}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleAction(user.id, "Edit")}
                    className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded transition-colors inline-block"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-[var(--border-subtle)]">
            <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <h3 className="font-bold text-[var(--text-primary)]">
                {t("Add User")}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-[var(--text-muted)] hover:bg-[var(--bg-base)] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">
                  {t("Name")}
                </label>
                <input
                  required
                  type="text"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  className="w-full border border-[var(--border-subtle)] rounded-lg p-2 text-sm focus:border-[var(--accent-primary)] outline-none bg-[var(--bg-base)] text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">
                  {t("Email")}
                </label>
                <input
                  required
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full border border-[var(--border-subtle)] rounded-lg p-2 text-sm focus:border-[var(--accent-primary)] outline-none bg-[var(--bg-base)] text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">
                  {t("Role")}
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="w-full border border-[var(--border-subtle)] rounded-lg p-2 text-sm focus:border-[var(--accent-primary)] outline-none bg-[var(--bg-base)] text-[var(--text-primary)]"
                >
                  <option>Admin</option>
                  <option>Operator</option>
                  <option>Engineer</option>
                  <option>Viewer</option>
                </select>
              </div>
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[var(--bg-base)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] text-sm font-semibold rounded-lg transition-colors"
                >
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  {t("Confirm")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
