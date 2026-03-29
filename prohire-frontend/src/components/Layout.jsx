import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Layout({ children }) {
  const navigate = useNavigate();

  const footerLinks = {
    Platform: [
      { label: "Find Professionals", path: "/professionals" },
      { label: "Post a Project", path: "/professionals" },
      { label: "Browse Categories", path: "/professionals" },
    ],
    Company: [
      { label: "About Us", path: "/" },
      { label: "Blog", path: "/" },
      { label: "Careers", path: "/" },
    ],
    Support: [
      { label: "Help Center", path: "/" },
      { label: "Contact Us", path: "/" },
      { label: "FAQ", path: "/" },
    ],
    Legal: [
      { label: "Privacy Policy", path: "/" },
      { label: "Terms of Service", path: "/" },
      { label: "Cookie Policy", path: "/" },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <main className="flex-1">{children}</main>

      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <h3 className="text-2xl font-bold text-gradient">ProHire</h3>
              </div>
              <p className="text-primary-300 leading-relaxed text-sm">
                Connecting talented professionals with businesses worldwide. Find the perfect expert for your project.
              </p>
              <div className="flex gap-4 mt-6">
                <button className="w-10 h-10 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg flex items-center justify-center transition">
                  f
                </button>
                <button className="w-10 h-10 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg flex items-center justify-center transition">
                  t
                </button>
                <button className="w-10 h-10 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg flex items-center justify-center transition">
                  in
                </button>
              </div>
            </div>

            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-bold text-lg mb-4">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => navigate(link.path)}
                        className="text-primary-300 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-700 pt-8">
            <div className="mb-8 bg-gradient-to-r from-purple-900 to-pink-900 p-4 sm:p-6 rounded-lg">
              <h4 className="font-bold text-lg mb-3">Stay Updated</h4>
              <p className="text-primary-200 mb-4 text-sm">Subscribe to get latest job opportunities and updates.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="btn-primary bg-gradient-to-r from-purple-500 to-pink-500 border-0 px-6">
                  Subscribe
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 border-t border-gray-700">
              <p className="text-primary-300 text-sm">© 2026 ProHire Platform. All rights reserved.</p>
              <div className="flex gap-6 text-sm">
                <button className="text-primary-200 hover:text-white transition">Terms</button>
                <button className="text-primary-300 hover:text-white transition">Privacy</button>
                <button className="text-primary-200 hover:text-white transition">Cookies</button>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-40"
          title="Scroll to Top"
        >
          ?
        </button>
      </footer>
    </div>
  );
}

export default Layout;

