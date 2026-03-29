import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  createService,
  deleteService,
  fetchCategories,
  fetchMyProfessionalProfile,
  fetchProfessionals,
  fetchServices,
  getCurrentUser,
  updateMyProfile,
  updateProfessional,
  updateService,
} from "../api";
import { useAuth } from "../context/useAuth";

function Profile() {
  const { user, refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const professionalId = searchParams.get("professionalId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewProfessional, setViewProfessional] = useState(null);
  const [myProfessional, setMyProfessional] = useState(null);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);

  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    location: "",
    company: "",
    website: "",
    bio: "",
    linkedIn: "",
    github: "",
    twitter: "",
    portfolio: "",
    title: "",
    hourlyRate: 0,
    skills: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const [serviceForm, setServiceForm] = useState({ id: "", title: "", description: "", price: "" });

  const isViewingOtherProfessional = Boolean(professionalId);
  const canEditOwnProfile = !isViewingOtherProfessional;
  const canManageServices = canEditOwnProfile && user?.role === "professional";

  const profileTitle = useMemo(() => {
    if (isViewingOtherProfessional) return "Professional Profile";
    if (user?.role === "admin") return "Admin Profile";
    if (user?.role === "professional") return "Professional Profile";
    return "My Profile";
  }, [isViewingOtherProfessional, user?.role]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const me = await getCurrentUser();

        if (professionalId) {
          const pros = await fetchProfessionals();
          const selected = pros.find((p) => String(p.id) === String(professionalId));
          if (!selected) throw new Error("Professional not found");
          setViewProfessional(selected);
          setServices(await fetchServices(selected.id));
          return;
        }

        setProfileForm({
          name: me.name || "",
          phone: me.profile?.phone || "",
          location: me.profile?.location || "",
          company: me.profile?.company || "",
          website: me.profile?.website || "",
          bio: me.profile?.bio || "",
          linkedIn: me.linkedIn || "",
          github: me.github || "",
          twitter: me.twitter || "",
          portfolio: me.portfolio || "",
          title: "",
          hourlyRate: 0,
          skills: "",
        });

        if (me.role === "professional") {
          const pro = await fetchMyProfessionalProfile();
          setMyProfessional(pro);
          setServices(await fetchServices(pro.id));
          setCategories(await fetchCategories());
          setProfileForm((prev) => ({
            ...prev,
            title: pro.title || "",
            location: pro.location || prev.location,
            bio: pro.bio || prev.bio,
            hourlyRate: Number(String(pro.rate).replace(/[^0-9]/g, "")) || 0,
            skills: (pro.skills || []).join(", "),
          }));
        }
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [professionalId]);

  const handleSaveProfile = async () => {
    try {
      setError("");
      const payload = {
        name: profileForm.name,
        phone: profileForm.phone,
        location: profileForm.location,
        company: profileForm.company,
        website: profileForm.website,
        bio: profileForm.bio,
        linkedIn: profileForm.linkedIn,
        github: profileForm.github,
        twitter: profileForm.twitter,
        portfolio: profileForm.portfolio,
        title: profileForm.title,
        hourlyRate: Number(profileForm.hourlyRate || 0),
        skills: profileForm.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      await updateMyProfile(payload);
      if (myProfessional) {
        await updateProfessional(myProfessional.id, {
          title: payload.title,
          rate: payload.hourlyRate,
          location: payload.location,
          bio: payload.bio,
          skills: payload.skills,
        });
        const refreshed = await fetchMyProfessionalProfile();
        setMyProfessional(refreshed);
      }

      await refreshUser();
      setIsEditing(false);
      alert("Profile updated");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    if (!myProfessional) return;

    try {
      if (serviceForm.id) {
        await updateService(myProfessional.id, serviceForm.id, {
          title: serviceForm.title,
          description: serviceForm.description,
          price: Number(serviceForm.price || 0),
        });
      } else {
        await createService(myProfessional.id, {
          title: serviceForm.title,
          description: serviceForm.description,
          price: Number(serviceForm.price || 0),
        });
      }

      setServices(await fetchServices(myProfessional.id));
      setServiceForm({ id: "", title: "", description: "", price: "" });
    } catch (err) {
      setError(err.message || "Service operation failed");
    }
  };

  const handleDeleteService = async (id) => {
    if (!myProfessional) return;
    if (!window.confirm("Delete this service?")) return;
    try {
      await deleteService(myProfessional.id, id);
      setServices(await fetchServices(myProfessional.id));
    } catch (err) {
      setError(err.message || "Failed to delete service");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center animate-pulse">Loading profile...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 animate-fade-in">{error}</div>;
  }

  if (isViewingOtherProfessional && viewProfessional) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 py-10 relative animate-fade-in">
        <div className="max-w-5xl mx-auto px-6">
          <div className="card mb-6 shadow-card-hover hover:shadow-glow">
            <h1 className="text-3xl font-bold text-gray-800 animate-slide-up">{viewProfessional.name}</h1>
            <p className="text-purple-700 mt-1 text-xl font-semibold">{viewProfessional.title}</p>
            <p className="text-gray-600 mt-3 leading-relaxed">{viewProfessional.bio}</p>
            <p className="text-sm text-gray-500 mt-2">📍 Location: {viewProfessional.location}</p>
            <p className="text-sm text-gray-500">💰 Rate: {viewProfessional.rate}</p>
          </div>

          <div className="card shadow-card-hover">
            <h2 className="text-xl font-bold mb-4 animate-slide-up">Services</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((s) => (
                <div key={s.id} className="border rounded-xl p-6 hover:shadow-glow transition-all hover:scale-105 backdrop-blur-sm bg-white/60">
                  <p className="font-semibold text-xl text-gray-800">{s.title}</p>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{s.description}</p>
                  <p className="text-purple-600 font-bold mt-4 text-2xl animate-pulse-glow">{s.priceLabel}</p>
                </div>
              ))}
              {services.length === 0 && <p className="text-gray-500 col-span-full text-center py-12 animate-fade-in">No services listed.</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 py-6 sm:py-10 px-4 sm:px-6 relative animate-fade-in backdrop-blur-sm">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="card backdrop-blur-md bg-white/40 shadow-xl border border-white/40 hover:shadow-2xl transition-all">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 p-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-slide-up">{profileTitle}</h1>
              <p className="text-lg text-gray-600 mt-2 font-semibold">Role: <span className="capitalize">{user?.role}</span></p>
            </div>
            {canEditOwnProfile && (
              <button onClick={() => setIsEditing((v) => !v)} className="btn-secondary px-6 py-3 text-base shadow-glow hover:animate-pulse-glow transition-all">
                {isEditing ? "Cancel" : "✏️ Edit Profile"}
              </button>
            )}
          </div>

          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {["name", "phone", "location", "company", "website", "linkedIn", "github", "twitter", "portfolio"].map((key) => (
              <div key={key} className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  disabled={!isEditing || !canEditOwnProfile}
                  value={profileForm[key]}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100/50 disabled:cursor-not-allowed backdrop-blur-sm hover:shadow-md transition-all"
                  placeholder={key === "linkedIn" ? "linkedin.com/in/yourprofile" : key === "github" ? "github.com/yourprofile" : key === "twitter" ? "twitter.com/yourhandle" : "Enter value"}
                />
              </div>
            ))}
          </div>

          {user?.role === "professional" && (
            <div className="p-8 grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">👨‍💼 Professional Title</label>
                <input
                  disabled={!isEditing}
                  value={profileForm.title}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100/50 backdrop-blur-sm hover:shadow-md"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">💰 Hourly Rate</label>
                <input
                  type="number"
                  disabled={!isEditing}
                  value={profileForm.hourlyRate}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, hourlyRate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100/50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">🛠️ Skills (comma separated)</label>
                <input
                  disabled={!isEditing}
                  value={profileForm.skills}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, skills: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100/50"
                />
              </div>
            </div>
          )}

          <div className="p-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">📝 Bio</label>
            <textarea
              disabled={!isEditing || !canEditOwnProfile}
              value={profileForm.bio}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, bio: e.target.value }))}
              className="w-full px-4 py-4 border border-gray-200 rounded-xl h-32 focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100/50 resize-vertical backdrop-blur-sm hover:shadow-lg transition-all"
              placeholder="Tell us about yourself and your expertise..."
            />
          </div>

          {isEditing && canEditOwnProfile && (
            <div className="p-8">
              <button onClick={handleSaveProfile} className="btn-primary w-full sm:w-auto px-8 py-4 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-glow hover:shadow-2xl hover:scale-105 transition-all animate-pulse-glow">
                💾 Save Profile
              </button>
            </div>
          )}
        </div>

        {canManageServices && (
          <div className="card backdrop-blur-lg bg-white/30 shadow-2xl border border-white/40">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 animate-slide-up p-8 rounded-t-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-green-200">Manage Services</h2>
            <form onSubmit={handleServiceSubmit} className="p-8 grid md:grid-cols-4 gap-6">
              <input
                value={serviceForm.title}
                onChange={(e) => setServiceForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Service title"
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                value={serviceForm.description}
                onChange={(e) => setServiceForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description"
                className="md:col-span-2 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="number"
                value={serviceForm.price}
                onChange={(e) => setServiceForm((prev) => ({ ...prev, price: e.target.value }))}
                placeholder="Price"
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                required
              />
              <button type="submit" className="btn-primary bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-glow w-full md:w-auto px-8 py-3 text-lg rounded-xl shadow-lg hover:scale-105">
                {serviceForm.id ? "Update" : "Create"} Service ✨
              </button>
            </form>

            <div className="p-8 space-y-4">
              {services.map((service) => (
                <div key={service.id} className="backdrop-blur-sm bg-white/70 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all border border-white/50 group">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-xl text-gray-800 group-hover:text-purple-600 transition">{service.title}</h4>
                      <p className="text-gray-600 mt-2 leading-relaxed">{service.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600 animate-pulse-glow">{service.priceLabel}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() =>
                          setServiceForm({
                            id: service.id,
                            title: service.title,
                            description: service.description,
                            price: service.price,
                          })
                        }
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md hover:shadow-glow transition"
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDeleteService(service.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md transition">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {services.length === 0 && <p className="text-gray-500 text-center py-12 text-lg font-semibold animate-fade-in">No services created yet. Add your first service! 🚀</p>}
            </div>
          </div>
        )}

        {user?.role === "professional" && categories.length > 0 && (
          <div className="card backdrop-blur bg-white/40 shadow-glow p-8 rounded-3xl">
            <h3 className="text-2xl font-bold mb-6 animate-slide-up">Available Categories</h3>
            <div className="flex gap-3 flex-wrap">
              {categories.map((cat) => (
                <span key={cat.id} className="px-6 py-3 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-full text-sm font-semibold shadow-md hover:shadow-glow hover:scale-105 transition-all animate-bounce-light">
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
