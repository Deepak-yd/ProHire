import { useEffect, useMemo, useState } from "react";
import {
  createCategory,
  createUser,
  deleteCategory,
  deleteProfessional,
  deleteService,
  deleteUser,
  fetchCategories,
  fetchDashboardMetrics,
  fetchPlatformSettings,
  fetchProfessionals,
  fetchReports,
  fetchServices,
  fetchUsers,
  updateCategory,
  updatePlatformSettings,
  updateProfessional,
  updateUser,
} from "../api";
import { useAuth } from "../context/useAuth";

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "users", label: "Users" },
  { id: "professionals", label: "Professionals" },
  { id: "categories", label: "Categories" },
  { id: "reports", label: "Reports" },
  { id: "settings", label: "Settings" },
];

function AdminPanel() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [pros, setPros] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reports, setReports] = useState(null);
  const [settings, setSettings] = useState({ platformName: "", commissionRate: 0 });
  const [selectedPro, setSelectedPro] = useState(null);
  const [services, setServices] = useState([]);

  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });
  const [newCategory, setNewCategory] = useState("");

  const loadDashboard = () => fetchDashboardMetrics().then(setMetrics);
  const loadUsers = () => fetchUsers().then(setUsers);
  const loadPros = () => fetchProfessionals().then(setPros);
  const loadCategories = () => fetchCategories().then(setCategories);
  const loadReports = () => fetchReports().then(setReports);
  const loadSettings = () => fetchPlatformSettings().then(setSettings);

  useEffect(() => {
    if (activeTab === "dashboard") loadDashboard();
    if (activeTab === "users") loadUsers();
    if (activeTab === "professionals") loadPros();
    if (activeTab === "categories") loadCategories();
    if (activeTab === "reports") loadReports();
    if (activeTab === "settings") loadSettings();
  }, [activeTab]);

  const roleOptions = useMemo(() => ["user", "professional", "admin"], []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createUser(newUser);
      setNewUser({ name: "", email: "", password: "", role: "user" });
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleUserStatus = async (user) => {
    try {
      await updateUser(user.id, { status: user.status === "Active" ? "Inactive" : "Active" });
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRoleChange = async (user, role) => {
    try {
      await updateUser(user.id, { role });
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const openProServices = async (pro) => {
    try {
      setSelectedPro(pro);
      setServices(await fetchServices(pro.id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!selectedPro) return;
    try {
      await deleteService(selectedPro.id, serviceId);
      setServices(await fetchServices(selectedPro.id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <aside className="w-64 bg-white shadow-xl sticky top-20 h-screen p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Panel</h2>
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-lg ${activeTab === tab.id ? "bg-purple-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button onClick={logout} className="w-full mt-8 text-left px-4 py-2 text-red-600">Logout</button>
      </aside>

      <main className="flex-1 p-8">
        {activeTab === "dashboard" && (
          <div className="grid md:grid-cols-4 gap-6">
            <div className="card"><p>Total Users</p><p className="text-3xl font-bold">{metrics?.totalUsers || 0}</p></div>
            <div className="card"><p>Professionals</p><p className="text-3xl font-bold">{metrics?.totalProfessionals || 0}</p></div>
            <div className="card"><p>Services</p><p className="text-3xl font-bold">{metrics?.totalServices || 0}</p></div>
            <div className="card"><p>Revenue</p><p className="text-3xl font-bold">${metrics?.totalRevenue || 0}</p></div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-6">
            <form onSubmit={handleCreateUser} className="card grid md:grid-cols-5 gap-3 items-end">
              <input value={newUser.name} onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))} placeholder="Name" className="px-3 py-2 border rounded-lg" required />
              <input value={newUser.email} onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))} placeholder="Email" className="px-3 py-2 border rounded-lg" required />
              <input type="password" value={newUser.password} onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))} placeholder="Password" className="px-3 py-2 border rounded-lg" required />
              <select value={newUser.role} onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value }))} className="px-3 py-2 border rounded-lg">
                {roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
              <button className="btn-primary bg-purple-600 border-0">Create</button>
            </form>

            <div className="card overflow-x-auto">
              <table className="w-full">
                <thead><tr><th className="text-left py-2">Name</th><th className="text-left py-2">Email</th><th className="text-left py-2">Role</th><th className="text-left py-2">Status</th><th className="text-left py-2">Actions</th></tr></thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t">
                      <td className="py-2">{u.name}</td>
                      <td className="py-2">{u.email}</td>
                      <td className="py-2">
                        <select value={u.role} onChange={(e) => handleRoleChange(u, e.target.value)} className="px-2 py-1 border rounded">
                          {roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
                        </select>
                      </td>
                      <td className="py-2">{u.status}</td>
                      <td className="py-2 flex gap-3">
                        <button onClick={() => toggleUserStatus(u)} className="text-blue-600">Toggle Status</button>
                        <button onClick={() => deleteUser(u.id).then(loadUsers).catch((err) => alert(err.message))} className="text-red-600">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "professionals" && (
          <div className="card space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr><th className="text-left py-2">Name</th><th className="text-left py-2">Title</th><th className="text-left py-2">Category</th><th className="text-left py-2">Actions</th></tr></thead>
                <tbody>
                  {pros.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="py-2">{p.name}</td>
                      <td className="py-2">{p.title}</td>
                      <td className="py-2">{p.category}</td>
                      <td className="py-2 flex gap-3">
                        <button onClick={() => openProServices(p)} className="text-green-600">Services</button>
                        <button onClick={() => {
                          const title = window.prompt("New title", p.title);
                          if (!title) return;
                          updateProfessional(p.id, { title }).then(loadPros).catch((err) => alert(err.message));
                        }} className="text-blue-600">Edit</button>
                        <button onClick={() => deleteProfessional(p.id).then(loadPros).catch((err) => alert(err.message))} className="text-red-600">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedPro && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Services: {selectedPro.name}</h3>
                <div className="space-y-2">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between border p-3 rounded">
                      <div>
                        <p className="font-medium">{service.title}</p>
                        <p className="text-sm text-gray-600">{service.priceLabel}</p>
                      </div>
                      <button onClick={() => handleDeleteService(service.id)} className="text-red-600">Delete</button>
                    </div>
                  ))}
                  {services.length === 0 && <p className="text-gray-500">No services found.</p>}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "categories" && (
          <div className="card space-y-4">
            <div className="flex gap-2">
              <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New category" className="px-3 py-2 border rounded-lg flex-1" />
              <button onClick={() => createCategory({ name: newCategory }).then(() => { setNewCategory(""); loadCategories(); }).catch((err) => alert(err.message))} className="btn-primary bg-green-600 border-0">Add</button>
            </div>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat.id} className="flex justify-between items-center border p-3 rounded">
                  <span>{cat.name}</span>
                  <div className="flex gap-3">
                    <button onClick={() => {
                      const name = window.prompt("Category name", cat.name);
                      if (!name) return;
                      updateCategory(cat.id, { name }).then(loadCategories).catch((err) => alert(err.message));
                    }} className="text-blue-600">Edit</button>
                    <button onClick={() => deleteCategory(cat.id).then(loadCategories).catch((err) => alert(err.message))} className="text-red-600">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-2">Users By Role</h3>
              <p>Admins: {reports?.usersByRole?.admin || 0}</p>
              <p>Professionals: {reports?.usersByRole?.professional || 0}</p>
              <p>Users: {reports?.usersByRole?.user || 0}</p>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-2">Hires By Status</h3>
              <p>Active: {reports?.hiresByStatus?.Active || 0}</p>
              <p>Completed: {reports?.hiresByStatus?.Completed || 0}</p>
              <p>Pending: {reports?.hiresByStatus?.Pending || 0}</p>
              <p className="mt-2 font-semibold">Revenue: ${reports?.totalRevenue || 0}</p>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="card space-y-4 max-w-xl">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Platform Name</label>
              <input value={settings.platformName} onChange={(e) => setSettings((p) => ({ ...p, platformName: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Commission Rate (%)</label>
              <input type="number" value={settings.commissionRate} onChange={(e) => setSettings((p) => ({ ...p, commissionRate: Number(e.target.value) }))} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <button onClick={() => updatePlatformSettings(settings).then(loadSettings).then(() => alert("Settings saved")).catch((err) => alert(err.message))} className="btn-primary bg-purple-600 border-0">Save Settings</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminPanel;
