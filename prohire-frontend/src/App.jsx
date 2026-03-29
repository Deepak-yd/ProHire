import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Professionals from "./pages/Professionals";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import MyHires from "./pages/MyHires";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import Connections from "./pages/Connections";
import Jobs from "./pages/Jobs";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/professionals"
            element={
              <ProtectedRoute>
                <Professionals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
            }
          />
          <Route
            path="/hires"
            element={
            <ProtectedRoute>
              <MyHires />
            </ProtectedRoute>
            }
          />
          <Route
            path="/connections"
            element={
            <ProtectedRoute>
              <Connections />
            </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
            <ProtectedRoute role={["admin"]}>
              <AdminPanel />
            </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
