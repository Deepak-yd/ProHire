import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, loginWithGoogle } from "../api";
import { useAuth } from "../context/useAuth";

const GOOGLE_SCRIPT_ID = "google-identity-script";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function parseJwt(token) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
      .join("")
  );
  return JSON.parse(json);
}

function Login() {
  const navigate = useNavigate();
  const { applySession, token } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) navigate("/dashboard");
  }, [token, navigate]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const existing = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existing) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.id = GOOGLE_SCRIPT_ID;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  const handleGoogle = async () => {
    setError("");
    if (GOOGLE_CLIENT_ID && window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            const payload = parseJwt(response.credential);
            if (!payload?.email) throw new Error("Google response is invalid");
            const session = await loginWithGoogle({
              email: payload.email,
              name: payload.name,
              picture: payload.picture,
            });
            applySession(session);
            navigate("/dashboard");
          } catch (err) {
            setError(err.message || "Google login failed");
          }
        },
      });
      window.google.accounts.id.prompt();
      return;
    }

    const fallbackEmail = window.prompt("Enter your Google email to continue:");
    if (!fallbackEmail) return;
    try {
      const session = await loginWithGoogle({ email: fallbackEmail, name: fallbackEmail.split("@")[0] });
      applySession(session);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Google login failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const session = await login({ username, password });
      applySession(session);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-10 px-4">
      <div className="w-full max-w-md card-elevated">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Sign in</h1>
          <p className="text-primary-200 mt-2">Access your account to use platform services.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-primary-200 mb-2">Username or Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username or email"
              required
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary-200 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white"
            />
          </div>

          {error && <p className="text-red-300 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3 bg-gradient-to-r from-purple-600 to-pink-600 border-0 disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full border border-gray-500 text-white py-3 rounded-lg hover:bg-gray-700 transition"
          >
            Continue with Google
          </button>
        </form>

        <p className="mt-6 text-center text-gray-300 text-sm">
          New here? <Link to="/register" className="text-purple-300">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
