import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api";
import { useAuth } from "../context/useAuth";

function Register() {
  const navigate = useNavigate();
  const { applySession } = useAuth();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    agreeTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.agreeTerms) {
      setError("Please accept terms and conditions.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const session = await register({
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      applySession(session);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-10 px-4">
      <div className="w-full max-w-md card-elevated">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Create account</h1>
          <p className="text-primary-200 mt-2">Choose your role and start using ProHire.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-primary-200 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary-200 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary-200 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary-200 mb-2">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white"
            >
              <option value="user">Client / Hiring</option>
              <option value="professional">Professional</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary-200 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary-200 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white"
            />
          </div>

          <label className="flex items-center gap-3 text-sm text-primary-200">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={form.agreeTerms}
              onChange={handleChange}
            />
            I agree to terms and privacy policy.
          </label>

          {error && <p className="text-red-300 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3 bg-gradient-to-r from-purple-600 to-pink-600 border-0 disabled:opacity-60"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-300 text-sm">
          Already registered? <Link to="/login" className="text-purple-300">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
