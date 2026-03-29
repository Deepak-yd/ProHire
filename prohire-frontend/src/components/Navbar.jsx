import { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, token, logout } = useAuth();

  const navItems = useMemo(() => {
    if (!token) {
      return [{ to: "/", label: "Home" }];
    }

    const base = [
      { to: "/", label: "Home" },
      { to: "/dashboard", label: "Dashboard" },
      { to: "/profile", label: "Profile" },
      { to: "/connections", label: "Connections" },
      { to: "/jobs", label: "Jobs" },
    ];

    if (user?.role === "admin") {
      return [...base, { to: "/admin", label: "Admin" }];
    }

    return [...base, { to: "/professionals", label: "Professionals" }, { to: "/hires", label: "Hires" }];
  }, [token, user?.role]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="group cursor-pointer flex items-center gap-2"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gradient">ProHire</h1>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? "text-purple-400 font-bold border-b-2 border-purple-400 pb-2 transition-all"
                  : "text-gray-300 hover:text-purple-400 transition-colors"
              }
            >
              {item.label}
            </NavLink>
          ))}

          {!token ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-lg border border-purple-400 text-white hover:bg-purple-700 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              >
                Register
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg"
              >
                <span>{user?.name || "Account"}</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50"
                  >
                    Dashboard
                  </button>
                  {user?.role === "admin" && (
                    <button
                      onClick={() => {
                        navigate("/admin");
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50"
                    >
                      Admin Panel
                    </button>
                  )}
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => setIsOpen((v) => !v)}
          className="md:hidden text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gradient-to-b from-gray-800 to-gray-900 px-6 py-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className="block text-gray-300 hover:text-purple-400 py-2"
            >
              {item.label}
            </NavLink>
          ))}
          {!token ? (
            <>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/login");
                }}
                className="w-full border border-purple-400 text-white rounded-lg py-2"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/register");
                }}
                className="w-full btn-primary mt-2 bg-gradient-to-r from-purple-600 to-pink-600"
              >
                Register
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full text-left text-red-300 py-2"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
